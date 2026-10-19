/**
 * Honey-verse: DB Sync Script
 * Inserts memory records for files already in Supabase Storage.
 * Safe to re-run — skips files already in the memories table.
 * 
 * Usage: node scripts/sync-db.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile, stat } from "fs/promises";
import { createReadStream } from "fs";
import { join, extname } from "path";
import { createHash } from "crypto";

const MEDIA_DIR   = "C:\\Users\\Bryce\\OneDrive\\Honey";
const BUCKET      = "honey-media";
const SUPABASE_URL = "https://hzfydimjthbdzjokpqtv.supabase.co";
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

const PHOTO_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm"]);
// Skip files over 50MB (Supabase free tier limit)
const MAX_SIZE = 50 * 1_000_000;

function mediaType(f) {
  const e = extname(f).toLowerCase();
  if (PHOTO_EXTS.has(e)) return "photo";
  if (VIDEO_EXTS.has(e)) return "video";
  return null;
}
function mimeType(f) {
  const e = extname(f).toLowerCase();
  return { ".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".gif":"image/gif",
           ".mp4":"video/mp4",".mov":"video/quicktime",".webm":"video/webm" }[e] ?? "application/octet-stream";
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

async function main() {
  if (!SERVICE_KEY) { console.error("❌  SUPABASE_SERVICE_ROLE_KEY not set"); process.exit(1); }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Load existing sha256s to skip already-inserted records
  const { data: existing } = await supabase.from("memories").select("sha256");
  const knownHashes = new Set((existing ?? []).map((r) => r.sha256));
  console.log(`ℹ️   ${knownHashes.size} records already in DB`);

  const entries = await readdir(MEDIA_DIR);
  const files = entries.filter((f) => mediaType(f) !== null).sort();

  let inserted = 0, skipped = 0, failed = 0;

  for (const filename of files) {
    const filepath = join(MEDIA_DIR, filename);
    const info = await stat(filepath);

    if (info.size > MAX_SIZE) {
      console.log(`⏭   Skip (too large): ${filename} (${(info.size/1e6).toFixed(1)} MB)`);
      skipped++;
      continue;
    }

    const hash = await sha256(filepath);

    if (knownHashes.has(hash)) {
      console.log(`⏭   Skip (in DB): ${filename}`);
      skipped++;
      continue;
    }

    const storagePath = `originals/${filename}`;
    const type = mediaType(filename);

    const { error } = await supabase.from("memories").insert({
      original_filename:   filename,
      original_path:       storagePath,
      media_type:          type,
      mime_type:           mimeType(filename),
      file_size_bytes:     info.size,
      sha256:              hash,
      date_confidence:     "unknown",
      capture_date_source: "none",
    });

    if (error) {
      console.log(`❌  ${filename}: ${error.message}`);
      failed++;
    } else {
      console.log(`✅  ${filename}`);
      knownHashes.add(hash);
      inserted++;
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅  Inserted: ${inserted}`);
  console.log(`⏭   Skipped:  ${skipped}`);
  console.log(`❌  Failed:   ${failed}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
