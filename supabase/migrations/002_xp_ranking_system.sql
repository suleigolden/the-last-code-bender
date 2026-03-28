-- ============================================================
-- XP Ranking System
-- ============================================================

-- Needed for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure the promotion fields exist (some older schema snapshots
-- may not have them).
ALTER TABLE benders
  ADD COLUMN IF NOT EXISTS community_vote boolean NOT NULL DEFAULT false;

ALTER TABLE benders
  ADD COLUMN IF NOT EXISTS is_founder boolean NOT NULL DEFAULT false;

-- Mark the founder row if it exists.
UPDATE benders
SET is_founder = true
WHERE handle = 'TheLastCodeBender';

-- ============================================================
-- XP Events table
-- Tracks every XP-earning action for audit and display
-- ============================================================
CREATE TABLE IF NOT EXISTS xp_events (
  id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  bender_id     uuid NOT NULL REFERENCES benders(id) ON DELETE CASCADE,
  handle        text NOT NULL,
  event_type    text NOT NULL CHECK (event_type IN (
                  'workspace_save',      -- +10 XP per save with commit msg
                  'skill_approved',      -- +50 XP when skill passes AI review
                  'challenge_win',       -- +100 XP
                  'challenge_submit',    -- +10 XP
                  'showcase_deployed',   -- +20 XP
                  'peer_endorsement',    -- +15 XP
                  'streak_7_days',       -- +25 XP
                  'streak_30_days',      -- +100 XP
                  'profile_complete'     -- +30 XP one-time bonus
                )),
  xp_awarded    int NOT NULL,
  metadata      jsonb,                  -- e.g. { "commit_message": "..." }
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xp_events_bender ON xp_events (bender_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_handle ON xp_events (handle);

-- RLS: anyone can read XP events (public leaderboard transparency)
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "xp_events_public_read" ON xp_events;
CREATE POLICY "xp_events_public_read" ON xp_events
  FOR SELECT USING (true);

-- ============================================================
-- Postgres function: award XP and check rank promotion
-- Called by triggers and Edge Functions
-- ============================================================
CREATE OR REPLACE FUNCTION award_xp(
  p_handle      text,
  p_event_type  text,
  p_xp          int,
  p_metadata    jsonb DEFAULT '{}'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bender      benders%ROWTYPE;
  v_new_xp      int;
  v_old_tier    text;
  v_new_tier    text;
  v_promoted    boolean := false;
BEGIN
  -- Get current bender
  SELECT * INTO v_bender FROM benders WHERE handle = p_handle;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Bender not found: ' || p_handle);
  END IF;

  v_old_tier := v_bender.rank_tier;
  v_new_xp   := v_bender.xp + p_xp;

  -- Determine new rank tier
  v_new_tier := CASE
    WHEN v_bender.is_founder        THEN 'TheLastCodeBender'
    WHEN v_new_xp >= 600
      AND v_bender.community_vote   THEN 'Master'
    WHEN v_new_xp >= 300
      AND v_bender.challenge_wins >= 1 THEN 'Senior'
    WHEN v_new_xp >= 100            THEN 'Journeyman'
    ELSE 'Apprentice'
  END;

  v_promoted := v_new_tier != v_old_tier;

  -- Update bender XP and rank
  UPDATE benders
  SET xp = v_new_xp,
      rank_tier = v_new_tier,
      last_active = now()
  WHERE handle = p_handle;

  -- Record the XP event
  INSERT INTO xp_events (bender_id, handle, event_type, xp_awarded, metadata)
  VALUES (v_bender.id, p_handle, p_event_type, p_xp, p_metadata);

  RETURN jsonb_build_object(
    'handle',    p_handle,
    'old_xp',    v_bender.xp,
    'new_xp',    v_new_xp,
    'old_tier',  v_old_tier,
    'new_tier',  v_new_tier,
    'promoted',  v_promoted
  );
END;
$$;

-- ============================================================
-- Trigger: award XP on workspace save
-- Fires every time a new snapshot is inserted
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_xp_on_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_handle text;
BEGIN
  -- Only award XP if the snapshot has a commit message
  -- (indicates intentional save, not auto-draft)
  IF NEW.commit_message IS NOT NULL AND trim(NEW.commit_message) != '' THEN
    SELECT b.handle INTO v_handle
    FROM benders b
    WHERE b.id = NEW.bender_id;

    IF v_handle IS NOT NULL THEN
      PERFORM award_xp(
        v_handle,
        'workspace_save',
        10,
        jsonb_build_object(
          'commit_message', NEW.commit_message,
          'snapshot_id', NEW.id
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS xp_on_snapshot_insert ON bender_profile_snapshots;

CREATE TRIGGER xp_on_snapshot_insert
  AFTER INSERT ON bender_profile_snapshots
  FOR EACH ROW EXECUTE FUNCTION trigger_xp_on_snapshot();

-- ============================================================
-- View: leaderboard (replaces leaderboard.json)
-- ============================================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  handle,
  github,
  discipline,
  rank,
  rank_tier,
  xp,
  challenge_wins,
  skill_live,
  avatar_url,
  is_founder,
  ROW_NUMBER() OVER (ORDER BY is_founder DESC, xp DESC) AS position
FROM benders
ORDER BY is_founder DESC, xp DESC;

