import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useRegistry } from '@/hooks/useRegistry';
import { computeFitScore } from '@/lib/fit-score';
import type { StackData } from '@/types/profile';
import type { Bender } from '@/types/registry';
import type { RecruiterFilters } from '@/types/recruiter';

const RANK_ORDER: Record<string, number> = {
  Apprentice: 0,
  Journeyman: 1,
  Senior: 2,
  Master: 3,
};

const MIN_RANK_ORDER: Record<string, number> = {
  'Journeyman+': 1,
  'Senior+': 2,
  'Master only': 3,
};

export interface ScoredBender {
  bender: Bender;
  fit: ReturnType<typeof computeFitScore>;
  stack: StackData | null;
}

export function useRecruiterFilters(filters: RecruiterFilters): {
  filteredBenders: ScoredBender[];
  requiredTechs: string[];
} {
  const { data: registry = [] } = useRegistry();

  const stackQueries = useQueries({
    queries: registry.map(b => ({
      queryKey: ['stack', b.discipline.toLowerCase(), b.handle],
      queryFn: async (): Promise<StackData | null> => {
        const res = await fetch(
          `/codebenders/${b.discipline.toLowerCase()}/${b.handle}/stack/stack.json`,
        );
        if (!res.ok) return null;
        return res.json() as Promise<StackData>;
      },
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  const stackMap = useMemo(() => {
    const map = new Map<string, StackData | null>();
    registry.forEach((b, i) => map.set(b.handle, stackQueries[i]?.data ?? null));
    return map;
  }, [registry, stackQueries]);

  const requiredTechs = useMemo(
    () =>
      filters.mustHaveStack
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean),
    [filters.mustHaveStack],
  );

  const maxWins = useMemo(
    () => Math.max(0, ...registry.map(b => b.challenge_wins)),
    [registry],
  );

  const filteredBenders = useMemo(() => {
    let results: Bender[] = registry;

    if (filters.disciplines.length > 0) {
      results = results.filter(b => filters.disciplines.includes(b.discipline as typeof filters.disciplines[number]));
    }

    if (filters.minRank !== 'Any') {
      const minOrder = MIN_RANK_ORDER[filters.minRank] ?? 0;
      results = results.filter(b => (RANK_ORDER[b.rank] ?? 0) >= minOrder);
    }

    if (filters.openToWork === 'Open to work') {
      results = results.filter(b => b.open_to_work);
    } else if (filters.openToWork === 'Not looking') {
      results = results.filter(b => !b.open_to_work);
    }

    const scored: ScoredBender[] = results.map(b => ({
      bender: b,
      fit: computeFitScore(b, requiredTechs, stackMap.get(b.handle) ?? null, maxWins),
      stack: stackMap.get(b.handle) ?? null,
    }));

    switch (filters.sortBy) {
      case 'Most XP':
        return scored.sort((a, b) => b.bender.xp - a.bender.xp);
      case 'Most recent':
        return scored.sort(
          (a, b) =>
            new Date(b.bender.last_active).getTime() -
            new Date(a.bender.last_active).getTime(),
        );
      case 'Most challenge wins':
        return scored.sort((a, b) => b.bender.challenge_wins - a.bender.challenge_wins);
      default:
        return scored.sort((a, b) => b.fit.overall - a.fit.overall);
    }
  }, [registry, filters, stackMap, requiredTechs, maxWins]);

  return { filteredBenders, requiredTechs };
}
