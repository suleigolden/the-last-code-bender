import type { Bender } from '@/types/registry';
import type { BenderRow } from '@/types/database';

/**
 * Adapts a live Supabase BenderRow to the legacy Bender shape used by
 * components that pre-date the database migration.
 * BenderRow.rank (integer) + BenderRow.rank_tier (string) → Bender.rank (tier name).
 */
export function rowToBender(row: BenderRow): Bender {
  return {
    handle: row.handle,
    github: row.github,
    discipline: row.discipline,
    rank: row.rank_tier,
    xp: row.xp,
    skill_version: row.skill_version,
    skill_live: row.skill_live,
    open_to_work: row.open_to_work,
    challenge_wins: row.challenge_wins,
    community_vote: row.community_vote ?? false,
    cached_stack: row.cached_stack ?? null,
    demo_url: row.demo_url,
    demo_views: row.demo_views,
    joined: row.registered_at,
    last_active: row.last_active,
    isPublished: true,
  };
}
