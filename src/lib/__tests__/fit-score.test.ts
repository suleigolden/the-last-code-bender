import { describe, it, expect } from 'vitest';
import { computeFitScore } from '@/lib/fit-score';
import type { Bender } from '@/types/registry';
import type { StackData } from '@/types/profile';

const TODAY = new Date().toISOString().slice(0, 10);
function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10);
}

const baseBender: Bender = {
  handle: 'testbender', github: 'testbender', discipline: 'Frontend',
  rank: 'Apprentice', xp: 0, skill_version: null, skill_live: false,
  open_to_work: false, challenge_wins: 0, community_vote: false,
  demo_url: null, demo_views: 0, joined: TODAY, last_active: TODAY,
};

const tsStack: StackData = {
  primary: [{ tech: 'TypeScript', category: 'language' }],
  familiar: [], aware: [],
};

describe('computeFitScore', () => {
  it('stackMatch = 100 when required tech is in primary', () => {
    const r = computeFitScore(baseBender, ['typescript'], tsStack, 0);
    expect(r.stackMatch).toBe(100);
  });

  it('stackMatch = 0 when no required techs match', () => {
    const r = computeFitScore(baseBender, ['rust'], tsStack, 0);
    expect(r.stackMatch).toBe(0);
  });

  it('activityScore = 100 when active today', () => {
    const r = computeFitScore({ ...baseBender, last_active: TODAY }, [], null, 0);
    expect(r.activityScore).toBe(100);
  });

  it('activityScore = 0 when last active 91 days ago', () => {
    const r = computeFitScore({ ...baseBender, last_active: daysAgo(91) }, [], null, 0);
    expect(r.activityScore).toBe(0);
  });
});
