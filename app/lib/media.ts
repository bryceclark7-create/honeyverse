export type MediaItem = {
  id: string;
  filename: string;
  path: string;
  media_type: "photo" | "video";
  file_size: number;
};

// Pairs: many IMG_XXXX files have a matching .JPEG + .MOV/.MP4
// We prefer showing the photo as thumbnail, video for playback
export function pairMedia(items: MediaItem[]): MediaItem[] {
  const videoBasenames = new Set(
    items
      .filter((i) => i.media_type === "video")
      .map((i) => i.filename.replace(/\.[^.]+$/, "").toUpperCase())
  );

  // Filter out .JPEG files that have a matching video (Live Photos) — keep them for photo view
  // For display: keep all photos + all standalone videos
  return items;
}

export function getVideos(items: MediaItem[]): MediaItem[] {
  return items.filter((i) => i.media_type === "video");
}

export function getPhotos(items: MediaItem[]): MediaItem[] {
  return items.filter((i) => i.media_type === "photo");
}

// Pick a random item from an array
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
