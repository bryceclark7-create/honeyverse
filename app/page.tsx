import { readFileSync } from "fs";
import { join } from "path";
import type { MediaItem } from "./lib/media";
import HoneyverseApp from "./HoneyverseApp";

function loadMedia(): MediaItem[] {
  try {
    const manifestPath = join(process.cwd(), "public", "media-manifest.json");
    const raw = readFileSync(manifestPath, "utf-8");
    // Strip BOM just in case
    const clean = raw.replace(/^\uFEFF/, "");
    return JSON.parse(clean) as MediaItem[];
  } catch (e) {
    console.error("Failed to load media manifest:", e);
    return [];
  }
}

export default function Page() {
  const media = loadMedia();
  return <HoneyverseApp media={media} />;
}
