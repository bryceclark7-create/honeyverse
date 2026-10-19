-- ═══════════════════════════════════════════════════════
-- Honey-verse: Add GPS columns to memories
-- Run in Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════

alter table memories
  add column if not exists latitude  double precision,
  add column if not exists longitude double precision;

-- Index for future proximity queries
create index if not exists memories_captured_at_idx on memories (captured_at);
create index if not exists memories_media_type_idx  on memories (media_type);
