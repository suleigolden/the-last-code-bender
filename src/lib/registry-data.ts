/**
 * Collects every register-me.json at build time via Vite's import.meta.glob.
 * Adding a register-me.json to a profile folder is enough — no other file to edit.
 */
import type { Bender } from '@/types/registry';

interface RegisterMeJson {
  handle: string;
  discipline: string;
  github?: string;
  rank?: string;
  xp?: number;
  isPlaceholder?: boolean;
  isFounder?: boolean;
  open_to_work?: boolean;
  skill_live?: boolean;
  skill_version?: string | null;
  challenge_wins?: number;
  community_vote?: boolean;
  demo_url?: string | null;
  demo_views?: number;
  joined?: string;
  last_active?: string;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const today = new Date().toISOString().split('T')[0];

const modules = import.meta.glob<RegisterMeJson>(
  '../codebender-profiles/**/register-me.json',
  { eager: true, import: 'default' },
);

export const REGISTRY_DATA: Bender[] = Object.values(modules)
  .filter((reg) => !reg.isPlaceholder)
  .map((reg) => ({
    handle: reg.handle,
    github: reg.github ?? '',
    discipline: capitalize(reg.discipline),
    rank: reg.rank ?? 'Apprentice',
    xp: reg.xp ?? 0,
    skill_version: reg.skill_version ?? null,
    skill_live: reg.skill_live ?? false,
    open_to_work: reg.open_to_work ?? false,
    challenge_wins: reg.challenge_wins ?? 0,
    community_vote: reg.community_vote ?? false,
    demo_url: reg.demo_url ?? null,
    demo_views: reg.demo_views ?? 0,
    joined: reg.joined ?? today,
    last_active: reg.last_active ?? today,
  }))
  .sort((a, b) => {
    if (a.discipline.toLowerCase() === 'founder') return -1;
    if (b.discipline.toLowerCase() === 'founder') return 1;
    return a.handle.localeCompare(b.handle);
  });
