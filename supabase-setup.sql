-- ============================================================
-- StudyNotes — Supabase setup
-- Run this in the Supabase dashboard → SQL Editor → New query.
-- ============================================================

-- 1. Notes table
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subject     text not null check (subject in ('biology','chemistry','physics')),
  description text,
  tags        text[] default '{}',
  file_path   text not null,
  file_name   text not null,
  downloads   integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 2. Row Level Security
alter table notes enable row level security;

-- Anyone (including anonymous visitors) can READ notes.
create policy "public read notes"
  on notes for select
  using (true);

-- Anyone with the anon key can INSERT + UPDATE.
-- (Uploads are gated by the passcode in the app, not the DB.)
create policy "anon insert notes"
  on notes for insert
  with check (true);

create policy "anon update downloads"
  on notes for update
  using (true)
  with check (true);

-- ============================================================
-- 3. Storage bucket
-- After running the SQL above, go to Storage in the dashboard:
--   • Create a new bucket named exactly:  notes
--   • Mark it as a PUBLIC bucket
-- That lets visitors view/download files while the app controls uploads.
-- ============================================================
