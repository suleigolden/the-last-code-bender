import type { Challenge } from '@/types/challenge';

const STARTS_AT = '2026-03-20T00:00:00.000Z';
// 72-hour window
const ENDS_AT = new Date(new Date(STARTS_AT).getTime() + 72 * 60 * 60 * 1000).toISOString();

export const challenges: Challenge[] = [
  {
    id: 'week-01-pagination',
    title: 'The Pagination Problem',
    type: 'weekly-sprint',
    disciplines: ['All'],
    spec: 'Build a cursor-based pagination API for a posts table that handles 1M+ rows. No OFFSET queries allowed. Use your declared primary language.',
    bonus: 'Add a rate-limiter without a Redis dependency.',
    xpReward: { winner: 50, participant: 10 },
    scoring: { correctness: 40, performance: 30, style: 30 },
    submissionPath: 'challenges/active/week-01-pagination/submissions',
    startsAt: STARTS_AT,
    endsAt: ENDS_AT,
    status: 'active',
  },
];

export const activeChallenges = challenges.filter((c) => c.status === 'active');
export const completedChallenges = challenges.filter((c) => c.status === 'completed');
