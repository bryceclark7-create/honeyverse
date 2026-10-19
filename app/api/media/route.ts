import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase";

const BUCKET = "honey-media";
// Signed URLs live long enough to survive a session + browser cache window.
const FULL_EXPIRY  = 60 * 60 * 24;      // 24h for full-res (lightbox / video)
const THUMB_EXPIRY = 60 * 60 * 24 * 7;  // 7d for grid thumbnails

// Supabase image transform for grid cells: small, compressed webp.
// This is the single biggest performance win — grid cells no longer
// download multi-MB originals.
const THUMB_TRANSFORM = {
  width: 400,
  height: 400,
  resize: "cover" as const,
  quality: 60,
};

type Row = {
  id: string;
  original_filename: string;
  original_path: string;
  media_type: string;
  file_size_bytes: number;
  captured_at: string | null;
  description: string | null;
};

// For a video, the grid thumbnail comes from its companion still image
// (same basename, image extension) when one was uploaded.
function thumbPathFor(row: Row, imagePaths: Set<string>): string | null {
  if (row.media_type === "photo") return row.original_path;
  const base = row.original_path.replace(/\.[^.]+$/, "");
  for (const ext of [".JPEG", ".jpeg", ".JPG", ".jpg", ".PNG", ".png"]) {
    if (imagePaths.has(base + ext)) return base + ext;
  }
  return null; // standalone video with no companion still
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: memories, error } = await supabase
      .from("memories")
      .select("id, original_filename, original_path, media_type, file_size_bytes, captured_at, description")
      .order("captured_at", { ascending: true, nullsFirst: false });

    if (error) {
      console.error("DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!memories || memories.length === 0) {
      return NextResponse.json([]);
    }

    const rows = memories as Row[];

    // Set of all image paths, so a video can find its companion still.
    const imagePaths = new Set(
      rows.filter((r) => r.media_type === "photo").map((r) => r.original_path),
    );

    type Out = {
      id: string;
      filename: string;
      path: string | null;       // full-res signed URL
      thumb: string | null;      // small transformed signed URL (grid)
      media_type: string;
      file_size: number;
      captured_at: string | null;
      description: string | null;
    };
    const results: Out[] = [];

    const signFull = async (batch: Row[]) => {
      const { data, error: e } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(batch.map((r) => r.original_path), FULL_EXPIRY);
      if (e) { console.error("full sign error:", e); return batch.map(() => null); }
      return batch.map((_, i) => data[i]?.signedUrl ?? null);
    };

    // Thumbs are signed one at a time because each carries its own transform
    // and may point at a companion path. Pooled for throughput.
    const signThumb = async (path: string | null): Promise<string | null> => {
      if (!path) return null;
      const { data, error: e } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, THUMB_EXPIRY, { transform: THUMB_TRANSFORM });
      if (e) return null;
      return data?.signedUrl ?? null;
    };

    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const fullUrls = await signFull(batch);
      const thumbUrls = await Promise.all(
        batch.map((r) => signThumb(thumbPathFor(r, imagePaths))),
      );
      batch.forEach((r, idx) => {
        results.push({
          id:          r.id,
          filename:    r.original_filename,
          path:        fullUrls[idx],
          thumb:       thumbUrls[idx] ?? fullUrls[idx], // fall back to full if no thumb
          media_type:  r.media_type,
          file_size:   r.file_size_bytes,
          captured_at: r.captured_at ?? null,
          description: r.description ?? null,
        });
      });
    }

    return NextResponse.json(results, {
      headers: {
        // Metadata changes rarely now; let the browser reuse the manifest
        // across tab switches for 5 min, revalidating in the background.
        "Cache-Control": "private, max-age=300, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
