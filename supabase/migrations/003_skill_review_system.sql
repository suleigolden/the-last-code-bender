-- ============================================================
-- Skill review + storage
-- ============================================================

ALTER TABLE benders
  ADD COLUMN IF NOT EXISTS cached_skill text;

-- Note: `skill_live` + `skill_version` already exist in the
-- base schema and are updated by the Edge Function on approval.

