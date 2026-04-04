-- =============================================
-- Hindi Meme Sounds - Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text not null default 'from-pink-500 to-purple-600',
  created_at timestamptz not null default now()
);

-- Sounds
create table sounds (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  audio_url text not null,
  play_count integer not null default 0,
  download_count integer not null default 0,
  is_published boolean not null default true,
  -- future user upload fields (not used in UI yet)
  is_user_upload boolean not null default false,
  uploaded_by uuid,
  status text not null default 'approved' check (status in ('approved', 'pending', 'rejected')),
  created_at timestamptz not null default now()
);

-- Tags
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Sound <-> Category (many-to-many)
create table sound_categories (
  sound_id uuid not null references sounds(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (sound_id, category_id)
);

-- Sound <-> Tag (many-to-many)
create table sound_tags (
  sound_id uuid not null references sounds(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (sound_id, tag_id)
);

-- =============================================
-- Full-text search index
-- Searches across title + description combined
-- =============================================
alter table sounds add column search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) stored;

create index sounds_search_idx on sounds using gin(search_vector);
create index sounds_published_idx on sounds(is_published, created_at desc);
create index sounds_play_count_idx on sounds(play_count desc);

-- =============================================
-- Row Level Security
-- Public can read published sounds/categories/tags
-- Only service role (admin) can write
-- =============================================
alter table sounds enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table sound_categories enable row level security;
alter table sound_tags enable row level security;

-- Public read access
create policy "Public can read published sounds"
  on sounds for select using (is_published = true);

create policy "Public can read categories"
  on categories for select using (true);

create policy "Public can read tags"
  on tags for select using (true);

create policy "Public can read sound_categories"
  on sound_categories for select using (true);

create policy "Public can read sound_tags"
  on sound_tags for select using (true);

-- =============================================
-- Helper function: increment play/download count
-- Called from server action to avoid race conditions
-- =============================================
create or replace function increment_play_count(sound_id uuid)
returns void language sql as $$
  update sounds set play_count = play_count + 1 where id = sound_id;
$$;

create or replace function increment_download_count(sound_id uuid)
returns void language sql as $$
  update sounds set download_count = download_count + 1 where id = sound_id;
$$;
