-- ============================================================
-- Showcase: demo URL + view tracking
-- ============================================================

ALTER TABLE benders
  ADD COLUMN IF NOT EXISTS demo_description text;

ALTER TABLE benders
  ADD COLUMN IF NOT EXISTS demo_type text
  CHECK (demo_type IN ('live_app','component_library','api_demo','other'));

-- View count tracking
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS demo_views (
  id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  handle      text NOT NULL,
  viewed_at   timestamptz DEFAULT now(),
  viewer_ip   text
);

CREATE INDEX IF NOT EXISTS idx_demo_views_handle ON demo_views (handle);

-- Function: get view count for a bender
CREATE OR REPLACE FUNCTION get_demo_view_count(p_handle text)
RETURNS int
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::int
  FROM demo_views
  WHERE handle = p_handle;
$$;

-- Minimal RLS so client inserts work via the anon/public key
ALTER TABLE demo_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo_views_public_read" ON demo_views;
DROP POLICY IF EXISTS "demo_views_public_insert" ON demo_views;

CREATE POLICY "demo_views_public_read" ON demo_views
  FOR SELECT USING (true);

CREATE POLICY "demo_views_public_insert" ON demo_views
  FOR INSERT WITH CHECK (true);

