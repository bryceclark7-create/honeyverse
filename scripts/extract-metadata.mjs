/**
 * Honey-verse: Metadata Extraction Script
 *
 * Reads EXIF from every file in OneDrive/Honey, updates the memories table
 * with captured_at, GPS coordinates, width, height, and location caption.
 *
 * Usage:
 *   node scripts/extract-metadata.mjs
 *   node scripts/extract-metadata.mjs --dry-run
 */

import exifr from "exifr";
import { createClient } from "@supabase/supabase-js";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const MEDIA_DIR    = "C:\\Users\\Bryce\\OneDrive\\Honey";
const SUPABASE_URL  = "https://hzfydimjthbdzjokpqtv.supabase.co";
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN       = process.argv.includes("--dry-run");

const PHOTO_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm"]);

// ── Reverse geocode via nominatim (free, no key) ─────────────────────────────
const geoCache = new Map();

async function reverseGeocode(lat, lon) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (geoCache.has(key)) return geoCache.get(key);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=14`;
    const r = await fetch(url, {
      headers: { "User-Agent": "honeyverse-metadata-script/1.0" },
    });
    if (!r.ok) return null;
    const data = await r.json();
    const addr = data.address ?? {};

    // Build a short human-readable location
    const parts = [
      addr.suburb ?? addr.neighbourhood ?? addr.city_district,
      addr.city ?? addr.town ?? addr.village,
      addr.state,
    ].filter(Boolean);

    const location = parts.slice(0, 2).join(", ") || data.display_name?.split(",").slice(0, 2).join(",").trim() || null;
    geoCache.set(key, location);
    // Rate limit: 1 req/sec per Nominatim policy
    await new Promise((r) => setTimeout(r, 1100));
    return location;
  } catch {
    return null;
  }
}

// ── Extract metadata from a file ─────────────────────────────────────────────

async function extractMeta(filepath) {
  const ext = extname(filepath).toLowerCase();
  const isVideo = VIDEO_EXTS.has(ext);

  // For videos, try the companion JPEG first
  if (isVideo) {
    const base = filepath.replace(/\.[^.]+$/, "");
    for (const jpgExt of [".JPEG", ".jpeg", ".JPG", ".jpg"]) {
      try {
        const jpgPath = base + jpgExt;
        const meta = await extractMeta(jpgPath);
        if (meta?.capturedAt) return meta;
      } catch {}
    }
    return { capturedAt: null, confidence: "unknown", lat: null, lon: null, width: null, height: null };
  }

  try {
    const data = await exifr.parse(filepath, {
      pick: ["DateTimeOriginal", "CreateDate", "GPSLatitude", "GPSLongitude",
             "GPSLatitudeRef", "GPSLongitudeRef", "ImageWidth", "ImageHeight",
             "ExifImageWidth", "ExifImageHeight", "PixelXDimension", "PixelYDimension"],
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    });

    if (!data) return { capturedAt: null, confidence: "unknown", lat: null, lon: null, width: null, height: null };

    const capturedAt = data.DateTimeOriginal ?? data.CreateDate ?? null;
    const lat = data.latitude ?? null;
    const lon = data.longitude ?? null;
    const width  = data.ImageWidth  ?? data.ExifImageWidth  ?? data.PixelXDimension ?? null;
    const height = data.ImageHeight ?? data.ExifImageHeight ?? data.PixelYDimension ?? null;

    return {
      capturedAt: capturedAt instanceof Date ? capturedAt.toISOString() : capturedAt,
      confidence: capturedAt ? "exact" : "unknown",
      lat,
      lon,
      width,
      height,
    };
  } catch {
    return { capturedAt: null, confidence: "unknown", lat: null, lon: null, width: null, height: null };
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!SERVICE_KEY) {
    console.error("❌  SUPABASE_SERVICE_ROLE_KEY not set");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Fetch all memories from DB
  const { data: memories, error } = await supabase
    .from("memories")
    .select("id, original_filename, captured_at, width, height");

  if (error) { console.error("DB error:", error.message); process.exit(1); }
  console.log(`ℹ️   ${memories.length} memories in DB\n`);

  const entries = await readdir(MEDIA_DIR);
  const allFiles = new Set(entries.map((f) => f.toLowerCase()));

  let updated = 0, skipped = 0, noDate = 0, geoCount = 0, failed = 0;

  for (const memory of memories) {
    const filename = memory.original_filename;
    const filepath = join(MEDIA_DIR, filename);

    // Check file exists
    if (!allFiles.has(filename.toLowerCase())) {
      console.log(`⚠️   Not found locally: ${filename}`);
      continue;
    }

    // Extract metadata
    const meta = await extractMeta(filepath);

    // Reverse geocode if we have GPS
    let locationCaption = null;
    if (meta.lat && meta.lon) {
      if (!DRY_RUN) {
        locationCaption = await reverseGeocode(meta.lat, meta.lon);
        if (locationCaption) geoCount++;
      } else {
        locationCaption = `[geo: ${meta.lat.toFixed(4)}, ${meta.lon.toFixed(4)}]`;
      }
    }

    if (!meta.capturedAt) {
      console.log(`📅  No date: ${filename}`);
      noDate++;
    } else {
      const dateStr = new Date(meta.capturedAt).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
      const geoStr = locationCaption ? ` @ ${locationCaption}` : "";
      console.log(`✅  ${filename}: ${dateStr}${geoStr}`);
    }

    if (DRY_RUN) { skipped++; continue; }

    // Build update payload
    const update = {};
    if (meta.capturedAt) {
      update.captured_at      = meta.capturedAt;
      update.date_confidence  = meta.confidence;
      update.capture_date_source = "exif";
    }
    if (meta.width)  update.width  = meta.width;
    if (meta.height) update.height = meta.height;
    if (locationCaption) update.description = locationCaption;

    if (Object.keys(update).length === 0) { skipped++; continue; }

    const { error: updateErr } = await supabase
      .from("memories")
      .update(update)
      .eq("id", memory.id);

    if (updateErr) {
      console.log(`❌  Update failed: ${filename}: ${updateErr.message}`);
      failed++;
    } else {
      updated++;
    }
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`✅  Updated:    ${updated}`);
  console.log(`📅  No date:    ${noDate}`);
  console.log(`🗺️   Geocoded:   ${geoCount}`);
  console.log(`⏭   Skipped:    ${skipped}`);
  console.log(`❌  Failed:     ${failed}`);

  if (DRY_RUN) console.log("\n🔍 DRY RUN — no changes written");
}

main().catch((e) => { console.error(e); process.exit(1); });
