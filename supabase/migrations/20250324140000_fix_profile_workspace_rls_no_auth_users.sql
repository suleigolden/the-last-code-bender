-- RLS policies must not SELECT from auth.users: the authenticated role has no
-- SELECT on auth.users, which caused 42501 "permission denied for table users".
-- Match ownership via public.users (id = auth.uid()) joined to benders.github_login.

drop policy if exists "bender_profile_workspace_insert_owner" on bender_profile_workspace;
drop policy if exists "bender_profile_workspace_update_owner" on bender_profile_workspace;
drop policy if exists "bender_profile_snapshots_select_owner" on bender_profile_snapshots;
drop policy if exists "bender_profile_snapshots_insert_owner" on bender_profile_snapshots;

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
