import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard, fetchRadar, fetchRegistry } from '@/lib/registry';
import type { Bender, Leaderboard, Radar, RegistryStats } from '@/types/registry';

const STALE_TIME = 5 * 60 * 1000;

export function useRegistry() {
  return useQuery<Bender[]>({
    queryKey: ['registry'],
    queryFn: fetchRegistry,
    staleTime: STALE_TIME,
  });
}

export function useLeaderboard() {
  return useQuery<Leaderboard>({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    staleTime: STALE_TIME,
  });
}

export function useRadar() {
  return useQuery<Radar>({
    queryKey: ['radar'],
    queryFn: fetchRadar,
    staleTime: STALE_TIME,
  });
}

export function useRegistryStats(): {
  data: RegistryStats | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useRegistry();

  if (!data) {
    return { data: undefined, isLoading, isError };
  }

  const byDiscipline: Record<string, number> = {};
  const byRank: Record<string, number> = {};
  let openToWork = 0;
  let skillsLive = 0;

  for (const bender of data) {
    byDiscipline[bender.discipline] = (byDiscipline[bender.discipline] ?? 0) + 1;
    byRank[bender.rank] = (byRank[bender.rank] ?? 0) + 1;
    if (bender.open_to_work) openToWork++;
    if (bender.skill_live) skillsLive++;
  }

  return {
    data: {
      totalBenders: data.length,
      byDiscipline,
      byRank,
      openToWork,
      skillsLive,
    },
    isLoading,
    isError,
  };
}
