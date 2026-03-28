import { differenceInDays } from 'date-fns';
import type { Bender } from '@/types/registry';

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === 'string' ? v : null))
    .filter((v): v is string => v !== null)
    .map((v) => v.toLowerCase());
}

function asTechArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return item.toLowerCase();
      if (typeof item !== 'object' || item === null) return null;

      const obj = item as Record<string, unknown>;
      const tech = obj.tech;
      return typeof tech === 'string' ? tech.toLowerCase() : null;
    })
    .filter((v): v is string => v !== null);
}

export interface FitResult {
  overall: number;
  stackMatch: number | null;
  challengeScore: number;
  activityScore: number;
  matchedTechs: string[];
  missingTechs: string[];
}

export function computeFitScore(
  bender: Bender,
  requiredTechs: string[],
  maxWins: number,
): FitResult {
  const daysAgo = differenceInDays(new Date(), new Date(bender.last_active));
  const activityScore = Math.max(0, Math.round(100 - (daysAgo / 90) * 100));

  const challengeScore = maxWins > 0
    ? Math.round((bender.challenge_wins / maxWins) * 100)
    : 0;

  let stackMatch: number | null = null;
  let matchedTechs: string[] = [];
  let missingTechs: string[] = [];

  const cachedStack = bender.cached_stack as unknown;

  if (requiredTechs.length > 0 && cachedStack) {
    // Support both shapes:
    //  - legacy/current: { primary: [{ tech }], familiar: [{ tech }] }
    //  - newer cached form (per spec): { languages: string[] }

    const stackObj = cachedStack as Record<string, unknown>;
    const primaryTechs = asTechArray(stackObj.primary);
    const familiarTechs = asTechArray(stackObj.familiar);
    const languagesTechs = asStringArray(stackObj.languages);
    const frameworksTechs = asStringArray(stackObj.frameworks);

    const allTechs = [...primaryTechs, ...familiarTechs, ...languagesTechs, ...frameworksTechs];

    matchedTechs = requiredTechs.filter((t) => allTechs.includes(t));
    missingTechs = requiredTechs.filter(t => !allTechs.includes(t));
    stackMatch = Math.round((matchedTechs.length / requiredTechs.length) * 100);
  }

  let overall: number;
  if (stackMatch === null) {
    overall = Math.round(challengeScore * 0.5 + activityScore * 0.5);
  } else {
    overall = Math.round(stackMatch * 0.35 + challengeScore * 0.35 + activityScore * 0.30);
  }

  return { overall, stackMatch, challengeScore, activityScore, matchedTechs, missingTechs };
}
