export type MediaItem = {
  id: string;
  filename: string;
  path: string;        // full-resolution signed URL (lightbox / video)
  thumb: string;       // small transformed signed URL (grid cells)
  media_type: "photo" | "video";
  file_size: number;
  captured_at: string | null;
  description: string | null;
};

export function getVideos(items: MediaItem[]): MediaItem[] {
  return items.filter((i) => i.media_type === "video");
}

export function getPhotos(items: MediaItem[]): MediaItem[] {
  return items.filter((i) => i.media_type === "photo");
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatYear(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).getFullYear().toString();
}
