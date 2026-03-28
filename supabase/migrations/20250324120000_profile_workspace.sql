-- Hosted profile workspace: TSX sources edited in dashboard, previewed with Sandpack, stored in DB.

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

create policy "bender_profile_workspace_select_public"
  on bender_profile_workspace for select
  using (true);

-- Ownership via public.users (do not query auth.users — authenticated role lacks SELECT).
create policy "bender_profile_workspace_insert_owner"
  on bender_profile_workspace for insert
  with check (
    exists (
      select 1
      from benders b
      inner join public.users u on u.github_login = b.github_login
      where b.id = bender_id
        and u.id = auth.uid()
    )
  );

create policy "bender_profile_workspace_update_owner"
  on bender_profile_workspace for update
  using (
    exists (
      select 1
      from benders b
      inner join public.users u on u.github_login = b.github_login
      where b.id = bender_id
        and u.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from benders b
      inner join public.users u on u.github_login = b.github_login
      where b.id = bender_id
        and u.id = auth.uid()
    )
  );

create policy "bender_profile_snapshots_select_owner"
  on bender_profile_snapshots for select
  using (
    exists (
      select 1
      from benders b
      inner join public.users u on u.github_login = b.github_login
      where b.id = bender_id
        and u.id = auth.uid()
    )
  );

create policy "bender_profile_snapshots_insert_owner"
  on bender_profile_snapshots for insert
  with check (
    exists (
      select 1
      from benders b
      inner join public.users u on u.github_login = b.github_login
      where b.id = bender_id
        and u.id = auth.uid()
    )
  );
