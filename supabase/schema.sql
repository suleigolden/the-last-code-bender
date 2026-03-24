-- ============================================================
-- TheLastCodeBender — Supabase schema
-- Run this in the Supabase SQL editor for a fresh project
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- Enums
-- ────────────────────────────────────────────────────────────
create type discipline as enum (
  'Frontend', 'Backend', 'FullStack', 'Security', 'AI', 'DevOps', 'QA', 'Founder'
);

create type rank_tier as enum (
  'Apprentice', 'Journeyman', 'Senior', 'Master', 'TheLastCodeBender'
);

-- ────────────────────────────────────────────────────────────
-- users — mirrors auth.users with extra profile fields
-- ────────────────────────────────────────────────────────────
create table users (
  id            uuid primary key references auth.users(id) on delete cascade,
  github_login  text not null unique,
  github_id     bigint not null unique,
  avatar_url    text,
  name          text,
  email         text,
  created_at    timestamptz not null default now(),
  last_sign_in  timestamptz not null default now()
);

alter table users enable row level security;

-- Users can read any profile, only update their own
create policy "Users are publicly readable" on users
  for select using (true);

create policy "Users can update their own profile" on users
  for update using (auth.uid() = id);

-- Auto-upsert on sign-in via trigger
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, github_login, github_id, avatar_url, name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'user_name',
    (new.raw_user_meta_data->>'provider_id')::bigint,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'full_name',
    new.email
  )
  on conflict (id) do update set
    avatar_url   = excluded.avatar_url,
    name         = excluded.name,
    email        = excluded.email,
    last_sign_in = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ────────────────────────────────────────────────────────────
-- benders — the core rank registry
-- ────────────────────────────────────────────────────────────
create table benders (
  id            uuid primary key default gen_random_uuid(),
  handle        text not null unique,
  github        text not null,
  github_login  text not null unique,
  discipline    discipline not null,
  rank          integer not null,
  rank_tier     rank_tier not null default 'Apprentice',
  xp            integer not null default 0,
  skill_version text not null default '1.0.0',
  skill_live    boolean not null default false,
  open_to_work  boolean not null default false,
  challenge_wins integer not null default 0,
  demo_url      text,
  demo_views    integer not null default 0,
  profile_url   text,
  avatar_url    text,
  registered_at timestamptz not null default now(),
  last_active   timestamptz not null default now(),

  -- one rank per discipline
  unique (discipline, rank)
);

alter table benders enable row level security;

-- Benders are publicly readable
create policy "Benders are publicly readable" on benders
  for select using (true);

-- Only the owner can insert their own row
create policy "Authenticated users can register" on benders
  for insert with check (
    auth.role() = 'authenticated' and
    github_login = (select raw_user_meta_data->>'user_name' from auth.users where id = auth.uid())
  );

-- Only the owner can update their own row
create policy "Owners can update their bender" on benders
  for update using (
    github_login = (select raw_user_meta_data->>'user_name' from auth.users where id = auth.uid())
  );

-- ────────────────────────────────────────────────────────────
-- Indexes
-- ────────────────────────────────────────────────────────────
create index idx_benders_discipline on benders(discipline);
create index idx_benders_github_login on benders(github_login);
create index idx_benders_handle on benders(handle);
create index idx_benders_registered_at on benders(registered_at desc);

-- ────────────────────────────────────────────────────────────
-- Hosted profile workspace (dashboard editor → Sandpack preview)
-- ────────────────────────────────────────────────────────────
create table if not exists bender_profile_workspace (
  bender_id uuid primary key references benders(id) on delete cascade,
  files jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists bender_profile_snapshots (
  id uuid primary key default gen_random_uuid(),
  bender_id uuid not null references benders(id) on delete cascade,
  commit_message text not null,
  files jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_bender_profile_snapshots_bender
  on bender_profile_snapshots(bender_id, created_at desc);

alter table bender_profile_workspace enable row level security;
alter table bender_profile_snapshots enable row level security;

-- See supabase/migrations/20250324120000_profile_workspace.sql for RLS policies.

-- ────────────────────────────────────────────────────────────
-- Seed — TheLastCodeBender founder (rank 0 / special tier)
-- ────────────────────────────────────────────────────────────
insert into benders (
  handle, github, github_login, discipline, rank, rank_tier,
  xp, skill_version, skill_live, open_to_work, challenge_wins,
  profile_url, avatar_url
) values (
  'TheLastCodeBender',
  'https://github.com/suleigolden',
  'suleigolden',
  'Founder',
  0,
  'TheLastCodeBender',
  9999,
  '1.0.0',
  true,
  false,
  0,
  'https://github.com/suleigolden/the-last-code-bender',
  null
) on conflict do nothing;
