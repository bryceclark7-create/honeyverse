-- ═══════════════════════════════════════════════════════
-- Honey-verse: Initial Schema Migration
-- Run this in Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── household_members ──────────────────────────────────
-- Authorized users (husband + wife only)
create table if not exists household_members (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  role      text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now()
);

alter table household_members enable row level security;

-- Members can only see themselves
create policy "members_select_self"
  on household_members for select
  using (auth.uid() = user_id);

-- ── memories ───────────────────────────────────────────
create table if not exists memories (
  id                  uuid primary key default gen_random_uuid(),
  media_type          text not null check (media_type in ('photo', 'video')),
  original_path       text not null,        -- storage object path
  thumbnail_path      text,
  preview_path        text,
  original_filename   text not null,
  mime_type           text,
  file_size_bytes     bigint,
  sha256              text,
  captured_at         timestamptz,
  date_confidence     text check (date_confidence in ('exact', 'estimated', 'unknown')),
  capture_date_source text,
  duration_seconds    numeric,
  width               integer,
  height              integer,
  title               text,
  description         text,
  favorite            boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table memories enable row level security;

create policy "members_select_memories"
  on memories for select
  using (exists (select 1 from household_members where user_id = auth.uid()));

create policy "members_update_memories"
  on memories for update
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── collections ────────────────────────────────────────
create table if not exists collections (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  cover_memory_id uuid references memories(id) on delete set null,
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table collections enable row level security;

create policy "members_all_collections"
  on collections for all
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── collection_items ───────────────────────────────────
create table if not exists collection_items (
  collection_id uuid not null references collections(id) on delete cascade,
  memory_id     uuid not null references memories(id) on delete cascade,
  position      integer not null default 0,
  added_at      timestamptz not null default now(),
  primary key (collection_id, memory_id)
);

alter table collection_items enable row level security;

create policy "members_all_collection_items"
  on collection_items for all
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── memory_notes ───────────────────────────────────────
create table if not exists memory_notes (
  id         uuid primary key default gen_random_uuid(),
  memory_id  uuid not null references memories(id) on delete cascade,
  author_id  uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table memory_notes enable row level security;

create policy "members_all_notes"
  on memory_notes for all
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── memory_tags ────────────────────────────────────────
create table if not exists memory_tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

alter table memory_tags enable row level security;

create policy "members_all_tags"
  on memory_tags for all
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── memory_tag_assignments ─────────────────────────────
create table if not exists memory_tag_assignments (
  memory_id uuid not null references memories(id) on delete cascade,
  tag_id    uuid not null references memory_tags(id) on delete cascade,
  primary key (memory_id, tag_id)
);

alter table memory_tag_assignments enable row level security;

create policy "members_all_tag_assignments"
  on memory_tag_assignments for all
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── import_jobs ────────────────────────────────────────
create table if not exists import_jobs (
  id          uuid primary key default gen_random_uuid(),
  status      text not null default 'pending' check (status in ('pending','running','done','failed')),
  started_at  timestamptz,
  finished_at timestamptz,
  created_at  timestamptz not null default now()
);

alter table import_jobs enable row level security;

create policy "members_all_import_jobs"
  on import_jobs for all
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── import_items ───────────────────────────────────────
create table if not exists import_items (
  id             uuid primary key default gen_random_uuid(),
  job_id         uuid not null references import_jobs(id) on delete cascade,
  original_filename text not null,
  sha256         text,
  status         text not null default 'pending'
                   check (status in ('pending','processing','uploaded','verified','failed')),
  memory_id      uuid references memories(id) on delete set null,
  last_error     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table import_items enable row level security;

create policy "members_all_import_items"
  on import_items for all
  using (exists (select 1 from household_members where user_id = auth.uid()));

-- ── Storage: create private bucket ────────────────────
-- Run this separately in Supabase → Storage if the bucket doesn't exist yet:
--
--   insert into storage.buckets (id, name, public)
--   values ('honey-media', 'honey-media', false);
--
--   create policy "members_read_media"
--     on storage.objects for select
--     using (
--       bucket_id = 'honey-media' and
--       exists (select 1 from household_members where user_id = auth.uid())
--     );
--
--   create policy "members_upload_media"
--     on storage.objects for insert
--     with check (
--       bucket_id = 'honey-media' and
--       exists (select 1 from household_members where user_id = auth.uid())
--     );

-- ── updated_at trigger ─────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger memories_updated_at         before update on memories          for each row execute function set_updated_at();
create trigger collections_updated_at      before update on collections       for each row execute function set_updated_at();
create trigger memory_notes_updated_at     before update on memory_notes      for each row execute function set_updated_at();
create trigger import_items_updated_at     before update on import_items      for each row execute function set_updated_at();
