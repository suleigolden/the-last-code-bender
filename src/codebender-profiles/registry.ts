import type { BenderProfile } from './types';

/**
 * register-me.json — the only file a contributor edits.
 * This module auto-collects every register-me.json in the profile tree
 * at build time via Vite's import.meta.glob. No manual edits needed here.
 */

interface RegisterMeJson {
  handle: string;
  discipline: string;
  github?: string;
  rank?: string;
  xp?: number;
  portfolio?: string;
  tagline?: string;
  isFounder?: boolean;
  isPlaceholder?: boolean;
  socials?: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    email?: string;
  };
  stack?: {
    primary: { tech: string; category: string }[];
    familiar: { tech: string; category: string }[];
    aware: { tech: string; category: string }[];
  };
}

const modules = import.meta.glob<RegisterMeJson>('./**/register-me.json', {
  eager: true,
  import: 'default',
});

function toProfile(reg: RegisterMeJson): BenderProfile {
  return {
    handle: reg.handle,
    discipline: reg.discipline,
    rank: reg.rank ?? 'Apprentice',
    xp: reg.xp ?? 0,
    github: reg.github ?? '',
    ...(reg.portfolio !== undefined && { portfolio: reg.portfolio }),
    ...(reg.tagline !== undefined && { tagline: reg.tagline }),
    ...(reg.isFounder && { isFounder: true }),
    ...(reg.isPlaceholder && { isPlaceholder: true }),
    ...(reg.socials && { socials: reg.socials }),
    ...(reg.stack && { stack: reg.stack }),
  };
}

export const BENDER_PROFILES: BenderProfile[] = Object.values(modules)
  .map(toProfile)
  .sort((a, b) => {
    if (a.isFounder) return -1;
    if (b.isFounder) return 1;
    return 0;
  });
