-- ═══════════════════════════════════════════════════════
-- Honey-verse: Storage Bucket + sha256 Unique Constraint
-- Run this in Supabase → SQL Editor AFTER 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════

-- Create the private media storage bucket
insert into storage.buckets (id, name, public)
values ('honey-media', 'honey-media', false)
on conflict (id) do nothing;

-- Storage RLS: only household members can read media
create policy "members_read_media"
  on storage.objects for select
  using (
    bucket_id = 'honey-media' and
    exists (select 1 from household_members where user_id = auth.uid())
  );

-- Storage RLS: only household members can upload media
create policy "members_upload_media"
  on storage.objects for insert
  with check (
    bucket_id = 'honey-media' and
    exists (select 1 from household_members where user_id = auth.uid())
  );

-- Allow service role uploads (used by the upload script)
create policy "service_role_manage_media"
  on storage.objects for all
  using (bucket_id = 'honey-media')
  with check (bucket_id = 'honey-media');

-- Unique constraint on sha256 so upserts are idempotent
alter table memories
  add constraint memories_sha256_unique unique (sha256);
