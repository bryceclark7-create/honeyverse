"use client";

import { useState, useRef, useCallback } from "react";
import type { MediaItem } from "./lib/media";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Nav Bar ──────────────────────────────────────────────────────────────────

type Tab = "garden" | "time" | "scrapbook" | "listen";

function NavBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: (a: boolean) => React.ReactNode }[] = [
    { id: "garden",    label: "Garden",   icon: (a) => <HomeIcon active={a} /> },
    { id: "time",      label: "Time",     icon: (a) => <TimeIcon active={a} /> },
    { id: "scrapbook", label: "Memories", icon: (a) => <ScrapbookIcon active={a} /> },
    { id: "listen",    label: "Listen",   icon: (a) => <ListenIcon active={a} /> },
  ];
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(44,36,22,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        borderTop: "1px solid rgba(212,168,83,0.15)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: 8, paddingBottom: 4 }}>
        {items.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "6px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === id ? "var(--honey-accent)" : "rgba(250,247,242,0.4)",
              transition: "color 0.2s",
              minWidth: 56,
            }}
          >
            {icon(tab === id)}
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em" }}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.96)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16, zIndex: 101,
          color: "rgba(255,255,255,0.7)", background: "none", border: "none",
          fontSize: 24, cursor: "pointer", width: 44, height: 44,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >✕</button>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100vw", maxHeight: "100vh", padding: 16, boxSizing: "border-box" }}
      >
        {item.media_type === "video" ? (
          <video
            src={item.path}
            controls
            playsInline
            style={{
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "calc(100vh - 32px)",
              borderRadius: 12,
              background: "#000",
              display: "block",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.path}
            alt="Memory"
            style={{
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "calc(100vh - 32px)",
              borderRadius: 12,
              objectFit: "contain",
              display: "block",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Media Thumbnail ──────────────────────────────────────────────────────────

function thumbSrc(item: MediaItem): string {
  if (item.media_type === "photo") return item.path;
  return item.path.replace(/\.[^.]+$/, ".JPEG");
}

function MediaThumb({ item, onClick }: { item: MediaItem; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "100%", // 1:1 aspect ratio trick
        overflow: "hidden",
        borderRadius: 8,
        background: "#d6cfc6",
        border: "none",
        cursor: "pointer",
        display: "block",
      }}
    >
      {!loaded && (
        <div className="shimmer" style={{ position: "absolute", inset: 0 }} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbFailed ? item.path : thumbSrc(item)}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s",
        }}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!thumbFailed) { setThumbFailed(true); }
          else setLoaded(true);
        }}
      />
      {item.media_type === "video" && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" fill="white" width={16} height={16} style={{ marginLeft: 2 }}>
              <polygon points="5 3 19 12 5 21" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Garden Screen ────────────────────────────────────────────────────────────

function GardenScreen({ media, onSetTab, onOpenItem }: {
  media: MediaItem[];
  onSetTab: (t: Tab) => void;
  onOpenItem: (i: MediaItem) => void;
}) {
  const photos = media.filter((m) => m.media_type === "photo");
  const featured = photos[Math.floor(photos.length * 0.3)] ?? photos[0];
  const [surpriseItem, setSurpriseItem] = useState<MediaItem | null>(null);

  const handleSurprise = useCallback(() => {
    const pool = media.filter((m) => m !== surpriseItem);
    setSurpriseItem(pool[Math.floor(Math.random() * pool.length)]);
  }, [media, surpriseItem]);

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: 88 }}>
      {/* Hero — full-width, fixed height, no overflow */}
      <div style={{ position: "relative", width: "100%", height: "70svh", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/honey/IMG_7808.JPEG"
          alt="Honey"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(44,36,22,0.05) 0%, transparent 35%, rgba(44,36,22,0.65) 75%, rgba(44,36,22,0.95) 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 28px" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--honey-accent)", marginBottom: 4 }}>
            In loving memory
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "var(--honey-warm)", margin: "0 0 4px", fontFamily: "Georgia, serif" }}>
            Honey
          </h1>
          <p style={{ fontSize: 13, color: "rgba(250,247,242,0.6)", margin: 0 }}>
            Every moment, right here.
          </p>
        </div>
      </div>

      {/* Quick-nav buttons */}
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

      {/* Featured memory */}
      {featured && (
        <div style={{ padding: "20px 20px 0" }}>
          <p style={sectionLabel}>A memory</p>
          <button
            onClick={() => onOpenItem(featured)}
            style={{ width: "100%", border: "none", padding: 0, cursor: "pointer", background: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.path}
              alt=""
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 16, display: "block" }}
            />
          </button>
        </div>
      )}

      {/* Surprise me */}
      <div style={{ padding: "20px 20px 0" }}>
        <button
          onClick={handleSurprise}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12,
            border: "1px solid var(--honey-earth)", background: "transparent",
            color: "var(--honey-earth)", fontSize: 14, fontWeight: 500,
            letterSpacing: "0.05em", cursor: "pointer",
          }}
        >
          ✦ Surprise me
        </button>
        {surpriseItem && (
          <div style={{ marginTop: 12 }}>
            <MediaThumb item={surpriseItem} onClick={() => onOpenItem(surpriseItem)} />
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
        <button
          onClick={() => onSetTab("time")}
          style={{ marginTop: 10, width: "100%", background: "none", border: "none", color: "var(--honey-muted)", fontSize: 12, cursor: "pointer", padding: "6px 0" }}
        >
          See all {photos.length} photos →
        </button>
      </div>
    </div>
  );
}

// ─── Timeline Screen ──────────────────────────────────────────────────────────

function TimelineScreen({ media, onOpenItem }: { media: MediaItem[]; onOpenItem: (i: MediaItem) => void }) {
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const filtered = filter === "all" ? media : media.filter((m) => m.media_type === filter);

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: 88 }}>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(250,247,242,0.94)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        padding: "52px 20px 12px",
      }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}>
          Timeline
        </h2>
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
      <div style={{ padding: "4px 4px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
        {filtered.map((item) => (
          <MediaThumb key={item.id} item={item} onClick={() => onOpenItem(item)} />
        ))}
      </div>
    </div>
  );
}

// ─── Scrapbook Screen ─────────────────────────────────────────────────────────

const COLLECTIONS = [
  { id: "adventures", title: "Favorite Adventures", emoji: "🌿", filter: (m: MediaItem) => m.media_type === "photo" && /IMG_[789]\d{3}/i.test(m.filename) },
  { id: "sounds",     title: "The Sounds of Honey", emoji: "🎵", filter: (m: MediaItem) => m.media_type === "video" },
  { id: "earlyyears", title: "The Early Years",     emoji: "🌱", filter: (m: MediaItem) => m.media_type === "photo" && /IMG_[0-4]\d{3}/i.test(m.filename) },
  { id: "athome",     title: "Honey at Home",       emoji: "🏡", filter: (m: MediaItem) => m.media_type === "photo" },
];

function ScrapbookScreen({ media, onOpenItem }: { media: MediaItem[]; onOpenItem: (i: MediaItem) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openCol = COLLECTIONS.find((c) => c.id === openId);
  const colMedia = openCol ? media.filter(openCol.filter).slice(0, 60) : [];

  if (openId && openCol) {
    return (
      <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: 88 }}>
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(250,247,242,0.94)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          padding: "52px 20px 12px",
        }}>
          <button onClick={() => setOpenId(null)} style={{ background: "none", border: "none", color: "var(--honey-earth)", fontSize: 14, cursor: "pointer", padding: "0 0 8px" }}>
            ← Collections
          </button>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}>
            {openCol.emoji} {openCol.title}
          </h2>
          <p style={{ fontSize: 12, color: "var(--honey-muted)", margin: 0 }}>{colMedia.length} memories</p>
        </div>
        <div style={{ padding: "4px 4px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
          {colMedia.map((item) => (
            <MediaThumb key={item.id} item={item} onClick={() => onOpenItem(item)} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: 88, padding: "56px 20px 88px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}>Memories</h2>
      <p style={{ fontSize: 13, color: "var(--honey-muted)", margin: "0 0 24px" }}>Her story, collected.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {COLLECTIONS.map((col) => {
          const items = media.filter(col.filter).slice(0, 4);
          const total = media.filter(col.filter).length;
          return (
            <button
              key={col.id}
              onClick={() => setOpenId(col.id)}
              style={{
                width: "100%", textAlign: "left", borderRadius: 16, overflow: "hidden",
                background: "var(--honey-warm)", border: "1px solid rgba(139,111,71,0.15)",
                cursor: "pointer", padding: 0,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, height: 90 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ overflow: "hidden", background: "#d6cfc6" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbSrc(item)}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { (e.target as HTMLImageElement).src = item.path; }}
                    />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
                  <div key={i} className="shimmer" style={{ height: "100%" }} />
                ))}
              </div>
              <div style={{ padding: "12px 16px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--honey-dark)", margin: "0 0 2px" }}>{col.emoji} {col.title}</p>
                <p style={{ fontSize: 12, color: "var(--honey-muted)", margin: 0 }}>{total} memories</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Listen & Discover ────────────────────────────────────────────────────────

function ListenScreen({ media, onOpenItem }: { media: MediaItem[]; onOpenItem: (i: MediaItem) => void }) {
  const videos = media.filter((m) => m.media_type === "video");
  const [activeId, setActiveId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = videos.find((v) => v.id === activeId);

  return (
    <div style={{ width: "100%", overflowX: "hidden", overflowY: "auto", paddingBottom: 88 }}>
      <div style={{ padding: "56px 20px 16px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", fontFamily: "Georgia, serif", color: "var(--honey-dark)" }}>
          Listen &amp; Discover
        </h2>
        <p style={{ fontSize: 13, color: "var(--honey-muted)", margin: "0 0 24px" }}>Hear her. See her. Remember.</p>

        {activeVideo && (
          <div style={{ marginBottom: 24, borderRadius: 16, overflow: "hidden", background: "var(--honey-dark)" }} className="fade-in">
            <video
              ref={videoRef}
              key={activeVideo.id}
              src={activeVideo.path}
              controls
              playsInline
              style={{ width: "100%", display: "block", background: "#000", maxHeight: "40vh" }}
            />
            <div style={{ padding: "10px 16px 14px" }}>
              <p style={{ fontSize: 11, color: "var(--honey-accent)", margin: "0 0 2px", fontWeight: 500 }}>Now playing</p>
              <p style={{ fontSize: 13, color: "var(--honey-warm)", margin: 0 }}>{activeVideo.filename}</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {videos.map((v) => {
            const isActive = v.id === activeId;
            return (
              <button
                key={v.id}
                onClick={() => { setActiveId(v.id); setTimeout(() => videoRef.current?.play(), 150); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: 12,
                  borderRadius: 12, textAlign: "left", cursor: "pointer",
                  background: isActive ? "var(--honey-dark)" : "var(--honey-warm)",
                  border: `1px solid ${isActive ? "var(--honey-gold)" : "rgba(139,111,71,0.15)"}`,
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative", background: "#c8bfb4" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbSrc(v)}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: isActive ? "var(--honey-accent)" : "rgba(0,0,0,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg viewBox="0 0 24 24" fill="white" width={12} height={12} style={{ marginLeft: 2 }}>
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: isActive ? "var(--honey-accent)" : "var(--honey-earth)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {v.filename}
                  </p>
                  <p style={{ fontSize: 11, color: isActive ? "rgba(250,247,242,0.45)" : "var(--honey-muted)", margin: 0 }}>
                    {(v.file_size / 1_000_000).toFixed(1)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenItem(v); }}
                  style={{
                    flexShrink: 0, fontSize: 11, padding: "4px 10px", borderRadius: 8,
                    background: "rgba(200,149,42,0.15)", color: "var(--honey-gold)",
                    border: "none", cursor: "pointer",
                  }}
                >
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sectionLabel: React.CSSProperties = {
  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
  color: "var(--honey-muted)", marginBottom: 10,
};

function btnStyle(variant: "dark" | "earth"): React.CSSProperties {
  return {
    padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer",
    textAlign: "left", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em",
    background: variant === "dark" ? "var(--honey-dark)" : "var(--honey-earth)",
    color: "var(--honey-warm)",
  };
}

function filterBtn(active: boolean): React.CSSProperties {
  return {
    padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
    fontSize: 12, fontWeight: 500, letterSpacing: "0.04em",
    background: active ? "var(--honey-dark)" : "rgba(139,111,71,0.12)",
    color: active ? "var(--honey-warm)" : "var(--honey-earth)",
  };
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function HoneyverseApp({ media }: { media: MediaItem[] }) {
  const [tab, setTab] = useState<Tab>("garden");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  return (
    // Outer shell: full viewport, no overflow — all screens scroll internally
    <div style={{ width: "100vw", height: "100svh", overflow: "hidden", position: "relative", background: "var(--honey-ivory)" }}>
      <div style={{ width: "100%", height: "100%", overflowY: "auto", overflowX: "hidden" }}>
        {tab === "garden"    && <GardenScreen    media={media} onSetTab={setTab}  onOpenItem={setLightboxItem} />}
        {tab === "time"      && <TimelineScreen  media={media} onOpenItem={setLightboxItem} />}
        {tab === "scrapbook" && <ScrapbookScreen media={media} onOpenItem={setLightboxItem} />}
        {tab === "listen"    && <ListenScreen    media={media} onOpenItem={setLightboxItem} />}
      </div>

      <NavBar tab={tab} setTab={setTab} />

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}
