/**
 * Honey-verse Media Upload Script
 * 
 * Uploads all media from C:\Users\Bryce\OneDrive\Honey to Supabase Storage
 * and inserts/upserts records into the memories table.
 * 
 * Usage:
 *   node scripts/upload-media.mjs
 *
 * Flags:
 *   --dry-run    Preview what would be uploaded without uploading
 *   --force      Re-upload files that are already in storage
 */

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile, stat } from "fs/promises";
import { createReadStream } from "fs";
import { join, extname, basename } from "path";
import { createHash } from "crypto";

// ── Config ───────────────────────────────────────────────────────────────────

const MEDIA_DIR   = "C:\\Users\\Bryce\\OneDrive\\Honey";
const BUCKET      = "honey-media";
const SUPABASE_URL = "https://hzfydimjthbdzjokpqtv.supabase.co";
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE   = process.argv.includes("--force");

const PHOTO_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm"]);

// ── Helpers ──────────────────────────────────────────────────────────────────

function mediaType(filename) {
  const ext = extname(filename).toLowerCase();
  if (PHOTO_EXTS.has(ext)) return "photo";
  if (VIDEO_EXTS.has(ext)) return "video";
  return null;
}

function mimeType(filename) {
  const ext = extname(filename).toLowerCase();
  const map = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png",  ".gif": "image/gif",
    ".mp4": "video/mp4",  ".mov": "video/quicktime",
    ".webm": "video/webm",
  };
  return map[ext] ?? "application/octet-stream";
}

async function sha256(filepath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filepath);
    stream.on("data", (d) => hash.update(d));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

function log(icon, msg) {
  console.log(`${icon}  ${msg}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!SERVICE_KEY) {
    console.error("❌  SUPABASE_SERVICE_ROLE_KEY env var is not set.");
    console.error("    Run: $env:SUPABASE_SERVICE_ROLE_KEY='your_key'; node scripts/upload-media.mjs");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify bucket exists
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  if (bucketsErr) { console.error("❌  Cannot list buckets:", bucketsErr.message); process.exit(1); }
  const bucket = buckets.find((b) => b.id === BUCKET);
  if (!bucket) {
    console.error(`❌  Bucket '${BUCKET}' not found. Create it in Supabase → Storage first.`);
    process.exit(1);
  }

  // Scan media directory
  const entries = await readdir(MEDIA_DIR);
  const mediaFiles = entries.filter((f) => mediaType(f) !== null).sort();

  log("📂", `Found ${mediaFiles.length} media files in ${MEDIA_DIR}`);
  if (DRY_RUN) log("🔍", "DRY RUN — no files will be uploaded\n");

  let uploaded = 0, skipped = 0, failed = 0;

  for (const filename of mediaFiles) {
    const filepath = join(MEDIA_DIR, filename);
    const type     = mediaType(filename);
    const mime     = mimeType(filename);
    const info     = await stat(filepath);
    const storagePath = `originals/${filename}`;

    // Check if already uploaded (unless --force)
    if (!FORCE) {
      const { data: existing } = await supabase.storage
        .from(BUCKET)
        .list("originals", { search: filename });
      if (existing && existing.find((f) => f.name === filename)) {
        log("⏭ ", `Skip (exists): ${filename}`);
        skipped++;
        continue;
      }
    }

    if (DRY_RUN) {
      log("📤", `Would upload: ${filename} (${(info.size / 1_000_000).toFixed(1)} MB, ${type})`);
      continue;
    }

    // Compute checksum
    const hash = await sha256(filepath);

    // Upload to storage
    const fileBuffer = await readFile(filepath);
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mime,
        upsert: FORCE,
      });

    if (uploadErr && !uploadErr.message.includes("already exists")) {
      log("❌", `Failed: ${filename} — ${uploadErr.message}`);
      failed++;
      continue;
    }

    // Upsert memory record (idempotent on sha256)
    const { error: dbErr } = await supabase
      .from("memories")
      .upsert(
        {
          original_filename: filename,
          original_path:     storagePath,
          media_type:        type,
          mime_type:         mime,
          file_size_bytes:   info.size,
          sha256:            hash,
          date_confidence:   "unknown",
          capture_date_source: "none",
        },
        { onConflict: "sha256", ignoreDuplicates: false }
      );

    if (dbErr) {
      log("⚠️ ", `Uploaded but DB insert failed: ${filename} — ${dbErr.message}`);
    } else {
      log("✅", `Uploaded: ${filename} (${(info.size / 1_000_000).toFixed(1)} MB)`);
    }
    uploaded++;
  }

  console.log("\n─────────────────────────────────────────");
  console.log(`✅  Uploaded:  ${uploaded}`);
  console.log(`⏭   Skipped:   ${skipped}`);
  console.log(`❌  Failed:    ${failed}`);
  console.log(`📦  Total:     ${mediaFiles.length}`);

  if (!DRY_RUN && uploaded > 0) {
    console.log("\n🎉  Upload complete. Update the app to serve from Supabase Storage.");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
