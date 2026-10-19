import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase";

const BUCKET = "honey-media";
const SIGNED_URL_EXPIRY = 3600; // 1 hour

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all memory records, sorted by capture date (nulls last)
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

    // Generate signed URLs in batches of 50
    const results: { id: string; filename: string; path: string | null; media_type: string; file_size: number; captured_at: string | null; description: string | null }[] = [];
    for (let i = 0; i < memories.length; i += 50) {
      const batch = memories.slice(i, i + 50);
      const paths = batch.map((m) => m.original_path);

      const { data: urls, error: urlErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(paths, SIGNED_URL_EXPIRY);

      if (urlErr) {
        console.error("Signed URL error:", urlErr);
        // Fall back: include items without signed URLs so the page still loads
        batch.forEach((m) => results.push({ id: m.id, filename: m.original_filename, path: null, media_type: m.media_type, file_size: m.file_size_bytes, captured_at: m.captured_at ?? null, description: m.description ?? null }));
        continue;
      }

      batch.forEach((m, idx) => {
        results.push({
          id:          m.id,
          filename:    m.original_filename,
          path:        urls[idx]?.signedUrl ?? null,
          media_type:  m.media_type,
          file_size:   m.file_size_bytes,
          captured_at: m.captured_at ?? null,
          description: m.description ?? null,
        });
      });
    }

    return NextResponse.json(results, {
      headers: {
        // Always revalidate — signed URLs expire and metadata can change
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
