import { differenceInDays } from 'date-fns';
import type { Bender } from '@/types/registry';
import type { StackData } from '@/types/profile';

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
  stack: StackData | null,
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

  if (requiredTechs.length > 0 && stack) {
    const allTechs = [...stack.primary, ...stack.familiar].map(t => t.tech.toLowerCase());
    matchedTechs = requiredTechs.filter(t => allTechs.includes(t));
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
