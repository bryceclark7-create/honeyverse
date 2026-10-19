"use client";

import { useState, useEffect } from "react";
import type { MediaItem } from "./lib/media";
import HoneyverseApp from "./HoneyverseApp";

export default function Page() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    fetch("/api/media", { signal: controller.signal })
      .then((r) => {
        clearTimeout(timeout);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: MediaItem[]) => {
        // Filter out any items with null paths (failed signed URL)
        setMedia(data.filter((m) => m.path));
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeout);
        const msg = err?.name === "AbortError" ? "Timed out loading media" : String(err);
        console.error("Media load failed:", msg);
        setError(msg);
        setLoading(false);
      });

    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100svh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--honey-ivory)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <p style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--honey-muted)", margin: 0 }}>
          Opening her world…
        </p>
      </div>
    );
  }

  if (error || media.length === 0) {
    return (
      <div style={{
        minHeight: "100svh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 32,
        background: "var(--honey-ivory)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <p style={{ fontSize: 15, color: "var(--honey-dark)", marginBottom: 8, textAlign: "center" }}>
          {error ? "Could not load media" : "No memories found yet"}
        </p>
        <p style={{ fontSize: 12, color: "var(--honey-muted)", textAlign: "center", maxWidth: 280 }}>
          {error ?? "Run the upload script to import Honey's photos and videos."}
        </p>
      </div>
    );
  }

  return <HoneyverseApp media={media} />;
}
