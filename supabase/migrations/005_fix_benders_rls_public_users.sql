-- benders INSERT/UPDATE policies queried auth.users; the authenticated role
-- cannot SELECT auth.users, so REST PATCH returned 403 (same issue as
-- migrations/20250324140000_fix_profile_workspace_rls_no_auth_users.sql).

DROP POLICY IF EXISTS "Owners can update their bender" ON benders;
DROP POLICY IF EXISTS "Authenticated users can register" ON benders;

CREATE POLICY "Owners can update their bender" ON benders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.github_login = benders.github_login
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.github_login = benders.github_login
    )
  );

CREATE POLICY "Authenticated users can register" ON benders
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.github_login = benders.github_login
    )
  );
