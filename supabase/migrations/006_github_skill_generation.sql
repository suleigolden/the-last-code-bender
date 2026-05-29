ALTER TABLE benders
  ADD COLUMN IF NOT EXISTS journey_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS github_synced_at   timestamptz,
  ADD COLUMN IF NOT EXISTS github_data_cache  jsonb;

UPDATE benders
SET journey_started_at = registered_at
WHERE journey_started_at IS NULL;

DROP POLICY IF EXISTS "Owners can update their bender" ON benders;

CREATE POLICY "benders_owner_update" ON benders
  FOR UPDATE
  USING (
    github_login = (auth.jwt() ->> 'user_name')
  )
  WITH CHECK (
    github_login = (auth.jwt() ->> 'user_name')
    AND (
      journey_started_at = (
        SELECT b2.journey_started_at
        FROM benders b2
        WHERE b2.github_login = (auth.jwt() ->> 'user_name')
        LIMIT 1
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_benders_github_synced
  ON benders (github_synced_at);
