"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { MediaItem } from "./lib/media";

// Ã¢â€â‚¬Ã¢â€â‚¬ Icons Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  );
}
function TimeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <circle cx="12" cy="12" r="9" /><polyline strokeLinecap="round" points="12 7 12 12 15.5 14" />
    </svg>
  );
}
function ScrapbookIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M8 12h8M8 8h5M8 16h6" />
    </svg>
  );
}
function ListenIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <polygon strokeLinejoin="round" points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Nav Bar Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

type Tab = "garden" | "time" | "scrapbook" | "listen";

function NavBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: (a: boolean) => React.ReactNode }[] = [
    { id: "garden",    label: "Garden",   icon: (a) => <HomeIcon active={a} /> },
    { id: "time",      label: "Time",     icon: (a) => <TimeIcon active={a} /> },
    { id: "scrapbook", label: "Memories", icon: (a) => <ScrapbookIcon active={a} /> },
    { id: "listen",    label: "Listen",   icon: (a) => <ListenIcon active={a} /> },
  ];
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(44,36,22,0.97)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(212,168,83,0.15)",
      paddingTop: 8,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center", paddingBottom: 6 }}>
        {items.map(({ id, label, icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, height: 48,
            background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%",
            color: tab === id ? "var(--honey-accent)" : "rgba(250,247,242,0.4)",
            transition: "color 0.2s",
          }}>
            {icon(tab === id)}
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", lineHeight: 1 }}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Lightbox with swipe navigation Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function Lightbox({ item, allMedia, onClose, onNavigate }: {
  item: MediaItem;
  allMedia: MediaItem[];
  onClose: () => void;
  onNavigate: (item: MediaItem) => void;
}) {
  const dateStr = item.captured_at
    ? new Date(item.captured_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const idx = allMedia.findIndex((m) => m.id === item.id);
  const prev = idx > 0 ? allMedia[idx - 1] : null;
  const next = idx < allMedia.length - 1 ? allMedia[idx + 1] : null;

  // Keyboard navigation (desktop)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && prev) onNavigate(prev);
      else if (e.key === "ArrowRight" && next) onNavigate(next);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose, onNavigate]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return; // ignore tiny swipes
    if (dx < 0 && next) onNavigate(next);   // swipe left = next
    if (dx > 0 && prev) onNavigate(prev);   // swipe right = prev
  };

  return (
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.96)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        userSelect: "none",
      }}
    >
      {/* Close */}
      <button onClick={onClose} style={{
        position: "absolute", top: 16, right: 16, zIndex: 101,
        color: "rgba(255,255,255,0.7)", background: "none", border: "none",
        fontSize: 24, cursor: "pointer", width: 44, height: 44,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>&#x2715;</button>

      {/* Prev arrow */}
      {prev && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(prev); }}
          style={{
            position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
            zIndex: 101, color: "rgba(255,255,255,0.6)", background: "rgba(0,0,0,0.3)",
            border: "none", borderRadius: 8, width: 36, height: 48, cursor: "pointer",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >&#x2039;</button>
      )}

      {/* Next arrow */}
      {next && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(next); }}
          style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            zIndex: 101, color: "rgba(255,255,255,0.6)", background: "rgba(0,0,0,0.3)",
            border: "none", borderRadius: 8, width: 36, height: 48, cursor: "pointer",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >&#x203A;</button>
      )}

      {/* Media */}
      <div onClick={(e) => e.stopPropagation()} style={{
        maxWidth: "100vw", maxHeight: "100vh", padding: "16px 56px 0", boxSizing: "border-box",
      }}>
        {item.media_type === "video" ? (
          <video src={item.path} controls playsInline style={{
            maxWidth: "calc(100vw - 112px)", maxHeight: "calc(80vh - 32px)",
            borderRadius: 12, background: "#000", display: "block",
          }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.path} alt="Memory" style={{
            maxWidth: "calc(100vw - 112px)", maxHeight: "calc(80vh - 32px)",
            borderRadius: 12, objectFit: "contain", display: "block",
          }} />
        )}
      </div>

      {/* Caption */}
      <div onClick={(e) => e.stopPropagation()} style={{
        padding: "10px 60px 16px", textAlign: "center", maxWidth: "100vw", boxSizing: "border-box",
      }}>
        {dateStr && (
          <p style={{ fontSize: 13, color: "var(--honey-accent)", margin: "0 0 3px", fontWeight: 500 }}>{dateStr}</p>
        )}
        {item.description && (
          <p style={{ fontSize: 12, color: "rgba(250,247,242,0.6)", margin: 0 }}>
            &#x1F4CD; {item.description}
          </p>
        )}
        {/* Position indicator */}
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", margin: "6px 0 0" }}>
          {idx + 1} / {allMedia.length}
        </p>
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Media Thumbnail Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function thumbSrc(item: MediaItem): string {
  return item.thumb || item.path;
}

function MediaThumb({ item, onClick, eager }: { item: MediaItem; onClick: () => void; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <button onClick={onClick} style={{
      position: "relative", width: "100%", paddingBottom: "100%",
      overflow: "hidden", borderRadius: 8, background: "#d6cfc6",
      border: "none", cursor: "pointer", display: "block",
    }}>
      {!loaded && <div className="shimmer" style={{ position: "absolute", inset: 0 }} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbFailed ? item.path : thumbSrc(item)}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.3s",
        }}
        onLoad={() => setLoaded(true)}
        onError={() => { if (!thumbFailed) setThumbFailed(true); else setLoaded(true); }}
      />
      {item.media_type === "video" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" fill="white" width={16} height={16} style={{ marginLeft: 2 }}>
              <polygon points="5 3 19 12 5 21" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Garden Screen Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function GardenScreen({ media, onSetTab, onOpenItem }: {
  media: MediaItem[]; onSetTab: (t: Tab) => void; onOpenItem: (i: MediaItem) => void;
}) {
  const photos = media.filter((m) => m.media_type === "photo");
  // Featured: a photo from the middle of the dated set
  const datedPhotos = photos.filter((p) => p.captured_at);
  const featured = datedPhotos[Math.floor(datedPhotos.length * 0.4)] ?? photos[0];
  const hero = media.find((m) => m.filename === "IMG_7808.JPEG") ?? photos[0];
  const [surpriseItem, setSurpriseItem] = useState<MediaItem | null>(null);

  const handleSurprise = useCallback(() => {
    const pool = media.filter((m) => m !== surpriseItem);
    setSurpriseItem(pool[Math.floor(Math.random() * pool.length)]);
  }, [media, surpriseItem]);

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: "calc(96px + env(safe-area-inset-bottom, 0px))" }}>
      {/* Hero */}
      <div style={{ position: "relative", width: "100%", height: "70svh", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero?.path ?? ""} alt="Honey" loading="eager" fetchPriority="high" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(44,36,22,0.05) 0%, transparent 35%, rgba(44,36,22,0.65) 75%, rgba(44,36,22,0.95) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 28px" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--honey-accent)", marginBottom: 4 }}>In loving memory</p>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "var(--honey-warm)", margin: "0 0 4px", fontFamily: "Georgia, serif" }}>Honey</h1>
          <p style={{ fontSize: 13, color: "rgba(250,247,242,0.6)", margin: 0 }}>Every moment, right here.</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "20px 20px 4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <button onClick={() => onSetTab("time")} style={btnStyle("dark")}>
          <span style={{ fontSize: 11, opacity: 0.55, display: "block", marginBottom: 2 }}>Explore</span>
          The Timeline
        </button>
        <button onClick={() => onSetTab("listen")} style={btnStyle("earth")}>
          <span style={{ fontSize: 11, opacity: 0.55, display: "block", marginBottom: 2 }}>Hear her</span>
          Listen &amp; Discover
        </button>
      </div>

      {/* Featured */}
      {featured && (
        <div style={{ padding: "20px 20px 0" }}>
          <p style={sectionLabel}>A memory</p>
          <button onClick={() => onOpenItem(featured)} style={{ width: "100%", border: "none", padding: 0, cursor: "pointer", background: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.thumb || featured.path} alt="" loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 16, display: "block" }} />
            {featured.captured_at && (
              <p style={{ fontSize: 11, color: "var(--honey-muted)", margin: "6px 0 0", textAlign: "center" }}>
                {new Date(featured.captured_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </p>
            )}
          </button>
        </div>
      )}

      {/* Surprise */}
      <div style={{ padding: "20px 20px 0" }}>
        <button onClick={handleSurprise} style={{
          width: "100%", padding: "14px 0", borderRadius: 12,
          border: "1px solid var(--honey-earth)", background: "transparent",
          color: "var(--honey-earth)", fontSize: 14, fontWeight: 500, letterSpacing: "0.05em", cursor: "pointer",
        }}>&#x2726; Surprise me</button>
        {surpriseItem && (
          <div style={{ marginTop: 12 }}>
            <MediaThumb item={surpriseItem} onClick={() => onOpenItem(surpriseItem)} />
            {surpriseItem.captured_at && (
              <p style={{ fontSize: 11, color: "var(--honey-muted)", margin: "6px 0 0", textAlign: "center" }}>
                {new Date(surpriseItem.captured_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                {surpriseItem.description ? ` Ã‚Â· ${surpriseItem.description}` : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Recent grid */}
      <div style={{ padding: "24px 20px 8px" }}>
        <p style={sectionLabel}>Recent memories</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {photos.slice(0, 9).map((item) => (
            <MediaThumb key={item.id} item={item} onClick={() => onOpenItem(item)} />
          ))}
        </div>
        <button onClick={() => onSetTab("time")} style={{ marginTop: 10, width: "100%", background: "none", border: "none", color: "var(--honey-muted)", fontSize: 12, cursor: "pointer", padding: "6px 0" }}>
          See all {photos.length} photos &#x2192;
        </button>
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Timeline Screen Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function TimelineScreen({ media, onOpenItem }: { media: MediaItem[]; onOpenItem: (i: MediaItem) => void }) {
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const filtered = filter === "all" ? media : media.filter((m) => m.media_type === filter);

  // Sort by capture date ascending; undated items go last (sorted by filename)
  const sorted = [...filtered].sort((a, b) => {
    const da = a.captured_at ? new Date(a.captured_at).getTime() : Infinity;
    const db = b.captured_at ? new Date(b.captured_at).getTime() : Infinity;
    if (da !== db) return da - db;
    return a.filename.localeCompare(b.filename);
  });

  // Group by year (undated Ã¢â€ â€™ "Undated")
  type Group = { year: string; items: MediaItem[] };
  const groups: Group[] = [];
  for (const item of sorted) {
    const year = item.captured_at ? new Date(item.captured_at).getFullYear().toString() : "Undated";
    const last = groups[groups.length - 1];
    if (last && last.year === year) {
      last.items.push(item);
    } else {
      groups.push({ year, items: [item] });
    }
  }

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: "calc(96px + env(safe-area-inset-bottom, 0px))" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(250,247,242,0.94)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        padding: "52px 20px 12px",
      }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}>Timeline</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "photo", "video"] as const).map((f) => {
            const count = f === "all" ? media.length : media.filter((m) => m.media_type === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)} style={filterBtn(f === filter)}>
                {f === "all" ? `All (${count})` : f === "photo" ? `Photos (${count})` : `Videos (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.year}>
          <div style={{ padding: "16px 16px 8px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--honey-dark)", fontFamily: "Georgia, serif" }}>{group.year}</span>
            <span style={{ fontSize: 11, color: "var(--honey-muted)", letterSpacing: "0.1em" }}>{group.items.length} memories</span>
          </div>
          <div style={{ padding: "0 4px 4px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
            {group.items.map((item) => (
              <MediaThumb key={item.id} item={item} onClick={() => onOpenItem(item)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Scrapbook Screen Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const COLLECTIONS = [
  { id: "adventures", title: "Favorite Adventures", emoji: "&#x1F33F;", filter: (m: MediaItem) => m.media_type === "photo" && /IMG_[789]\d{3}/i.test(m.filename) },
  { id: "sounds",     title: "The Sounds of Honey", emoji: "&#x1F3B5;", filter: (m: MediaItem) => m.media_type === "video" },
  { id: "earlyyears", title: "The Early Years",     emoji: "&#x1F331;", filter: (m: MediaItem) => m.media_type === "photo" && /IMG_[0-4]\d{3}/i.test(m.filename) },
  { id: "athome",     title: "Honey at Home",       emoji: "&#x1F3E1;", filter: (m: MediaItem) => m.media_type === "photo" },
];

function ScrapbookScreen({ media, onOpenItem }: { media: MediaItem[]; onOpenItem: (i: MediaItem) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openCol = COLLECTIONS.find((c) => c.id === openId);
  const colMedia = openCol ? media.filter(openCol.filter).slice(0, 60) : [];

  if (openId && openCol) {
    return (
      <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: "calc(96px + env(safe-area-inset-bottom, 0px))" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(250,247,242,0.94)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", padding: "52px 20px 12px" }}>
          <button onClick={() => setOpenId(null)} style={{ background: "none", border: "none", color: "var(--honey-earth)", fontSize: 14, cursor: "pointer", padding: "0 0 8px" }}>&#x2190; Collections</button>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}
            dangerouslySetInnerHTML={{ __html: `${openCol.emoji} ${openCol.title}` }} />
          <p style={{ fontSize: 12, color: "var(--honey-muted)", margin: 0 }}>{colMedia.length} memories</p>
        </div>
        <div style={{ padding: "4px 4px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
          {colMedia.map((item) => <MediaThumb key={item.id} item={item} onClick={() => onOpenItem(item)} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingTop: 56, paddingLeft: 20, paddingRight: 20, paddingBottom: "calc(96px + env(safe-area-inset-bottom, 0px))" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}>Memories</h2>
      <p style={{ fontSize: 13, color: "var(--honey-muted)", margin: "0 0 24px" }}>Her story, collected.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {COLLECTIONS.map((col) => {
          const items = media.filter(col.filter).slice(0, 4);
          const total = media.filter(col.filter).length;
          return (
            <button key={col.id} onClick={() => setOpenId(col.id)} style={{ width: "100%", textAlign: "left", borderRadius: 16, overflow: "hidden", background: "var(--honey-warm)", border: "1px solid rgba(139,111,71,0.15)", cursor: "pointer", padding: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, height: 90 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ overflow: "hidden", background: "#d6cfc6" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbSrc(item)} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { (e.target as HTMLImageElement).src = item.path; }} />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => <div key={i} className="shimmer" style={{ height: "100%" }} />)}
              </div>
              <div style={{ padding: "12px 16px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--honey-dark)", margin: "0 0 2px" }}
                  dangerouslySetInnerHTML={{ __html: `${col.emoji} ${col.title}` }} />
                <p style={{ fontSize: 12, color: "var(--honey-muted)", margin: 0 }}>{total} memories</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Listen & Discover Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function ListenScreen({ media, onOpenItem }: { media: MediaItem[]; onOpenItem: (i: MediaItem) => void }) {
  const videos = media.filter((m) => m.media_type === "video");
  const [activeId, setActiveId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = videos.find((v) => v.id === activeId);

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: "calc(96px + env(safe-area-inset-bottom, 0px))" }}>
      <div style={{ padding: "56px 20px 16px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}>Listen &amp; Discover</h2>
        <p style={{ fontSize: 13, color: "var(--honey-muted)", margin: "0 0 24px" }}>Hear her. See her. Remember.</p>

        {activeVideo && (
          <div style={{ marginBottom: 24, borderRadius: 16, overflow: "hidden", background: "var(--honey-dark)" }} className="fade-in">
            <video ref={videoRef} key={activeVideo.id} src={activeVideo.path} controls playsInline
              style={{ width: "100%", display: "block", background: "#000", maxHeight: "40vh" }} />
            <div style={{ padding: "10px 16px 14px" }}>
              <p style={{ fontSize: 11, color: "var(--honey-accent)", margin: "0 0 2px", fontWeight: 500 }}>Now playing</p>
              <p style={{ fontSize: 13, color: "var(--honey-warm)", margin: 0 }}>
                {activeVideo.captured_at
                  ? new Date(activeVideo.captured_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "A memory of Honey"}
              </p>
              {activeVideo.description && (
                <p style={{ fontSize: 11, color: "rgba(250,247,242,0.45)", margin: "2px 0 0" }}>
                  &#x1F4CD; {activeVideo.description}
                </p>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {videos.map((v) => {
            const isActive = v.id === activeId;
            return (
              <button key={v.id} onClick={() => { setActiveId(v.id); setTimeout(() => videoRef.current?.play(), 150); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, textAlign: "left", cursor: "pointer", background: isActive ? "var(--honey-dark)" : "var(--honey-warm)", border: `1px solid ${isActive ? "var(--honey-gold)" : "rgba(139,111,71,0.15)"}` }}>
                <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative", background: "#c8bfb4" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbSrc(v)} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: isActive ? "var(--honey-accent)" : "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 24 24" fill="white" width={12} height={12} style={{ marginLeft: 2 }}><polygon points="5 3 19 12 5 21" /></svg>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: isActive ? "var(--honey-accent)" : "var(--honey-earth)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {v.captured_at
                      ? new Date(v.captured_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : "A memory of Honey"}
                  </p>
                  {v.description && (
                    <p style={{ fontSize: 11, color: isActive ? "rgba(250,247,242,0.45)" : "var(--honey-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {v.description}
                    </p>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); onOpenItem(v); }}
                  style={{ flexShrink: 0, fontSize: 11, padding: "4px 10px", borderRadius: 8, background: "rgba(200,149,42,0.15)", color: "var(--honey-gold)", border: "none", cursor: "pointer" }}>
                  Full
                </button>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Helpers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const sectionLabel: React.CSSProperties = {
  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
  color: "var(--honey-muted)", marginBottom: 10,
};
function btnStyle(v: "dark" | "earth"): React.CSSProperties {
  return { padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em", background: v === "dark" ? "var(--honey-dark)" : "var(--honey-earth)", color: "var(--honey-warm)" };
}
function filterBtn(active: boolean): React.CSSProperties {
  return { padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: active ? "var(--honey-dark)" : "rgba(139,111,71,0.12)", color: active ? "var(--honey-warm)" : "var(--honey-earth)" };
}

// Ã¢â€â‚¬Ã¢â€â‚¬ App Shell Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export default function HoneyverseApp({ media }: { media: MediaItem[] }) {
  const [tab, setTab] = useState<Tab>("garden");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  return (
    <div style={{ width: "100vw", height: "100svh", overflow: "hidden", position: "relative", background: "var(--honey-ivory)" }}>
      <div style={{ width: "100%", height: "100%", overflowY: "auto", overflowX: "hidden" }}>
        {tab === "garden"    && <GardenScreen    media={media} onSetTab={setTab} onOpenItem={setLightboxItem} />}
        {tab === "time"      && <TimelineScreen  media={media} onOpenItem={setLightboxItem} />}
        {tab === "scrapbook" && <ScrapbookScreen media={media} onOpenItem={setLightboxItem} />}
        {tab === "listen"    && <ListenScreen    media={media} onOpenItem={setLightboxItem} />}
      </div>
      <NavBar tab={tab} setTab={setTab} />
      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          allMedia={media}
          onClose={() => setLightboxItem(null)}
          onNavigate={(it) => setLightboxItem(it)}
        />
      )}
    </div>
  );
}
