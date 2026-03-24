import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BenderRow } from '@/types/database';

export const benderKeys = {
  all: ['benders'] as const,
  byDiscipline: (discipline: string) => ['benders', 'discipline', discipline] as const,
  byHandle: (handle: string) => ['benders', 'handle', handle] as const,
  handleAvailable: (handle: string) => ['benders', 'handleAvailable', handle] as const,
  hasClaimed: (githubLogin: string) => ['benders', 'hasClaimed', githubLogin] as const,
  search: (query: string) => ['benders', 'search', query] as const,
};

export function useAllBenders() {
  return useQuery({
    queryKey: benderKeys.all,
    queryFn: async (): Promise<BenderRow[]> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .order('rank', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBendersByDiscipline(discipline: string) {
  return useQuery({
    queryKey: benderKeys.byDiscipline(discipline),
    queryFn: async (): Promise<BenderRow[]> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .eq('discipline', discipline)
        .order('rank', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBenderByHandle(handle: string) {
  return useQuery({
    queryKey: benderKeys.byHandle(handle),
    queryFn: async (): Promise<BenderRow | null> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .eq('handle', handle)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(handle),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHandleAvailable(handle: string) {
  return useQuery({
    queryKey: benderKeys.handleAvailable(handle),
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('benders')
        .select('handle')
        .eq('handle', handle)
        .maybeSingle();
      if (error) throw error;
      return data === null;
    },
    enabled: handle.length >= 3,
    staleTime: 30 * 1000,
  });
}

export function useHasClaimedRank(githubLogin: string | null) {
  return useQuery({
    queryKey: benderKeys.hasClaimed(githubLogin ?? ''),
    queryFn: async (): Promise<BenderRow | null> => {
      if (!githubLogin) return null;
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .eq('github_login', githubLogin)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(githubLogin),
    staleTime: 60 * 1000,
  });
}

interface RegisterBenderInput {
  handle: string;
  github: string;
  github_login: string;
  discipline: BenderRow['discipline'];
  profile_url: string;
  avatar_url: string | null;
}

export function useRegisterBender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterBenderInput): Promise<BenderRow> => {
      // Determine the next available rank for this discipline
      const { data: existing, error: countError } = await supabase
        .from('benders')
        .select('rank')
        .eq('discipline', input.discipline)
        .order('rank', { ascending: false })
        .limit(1);
      if (countError) throw countError;

      const nextRank = existing && existing.length > 0 ? existing[0].rank + 1 : 1;

      const rankTier =
        nextRank <= 50 ? 'Apprentice'
        : nextRank <= 100 ? 'Journeyman'
        : nextRank <= 150 ? 'Senior'
        : nextRank <= 199 ? 'Master'
        : 'TheLastCodeBender';

      const { data, error } = await supabase
        .from('benders')
        .insert({
          handle: input.handle,
          github: input.github,
          github_login: input.github_login,
          discipline: input.discipline,
          rank: nextRank,
          rank_tier: rankTier as BenderRow['rank_tier'],
          xp: 0,
          skill_version: '1.0.0',
          skill_live: false,
          open_to_work: false,
          challenge_wins: 0,
          demo_url: null,
          demo_views: 0,
          profile_url: input.profile_url,
          avatar_url: input.avatar_url,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
      queryClient.invalidateQueries({ queryKey: benderKeys.byDiscipline(data.discipline) });
      queryClient.invalidateQueries({ queryKey: benderKeys.hasClaimed(data.github_login) });
    },
  });
}

export function useSearchBenders(query: string) {
  return useQuery({
    queryKey: benderKeys.search(query),
    queryFn: async (): Promise<BenderRow[]> => {
      const { data, error } = await supabase
        .from('benders')
        .select('*')
        .ilike('handle', `%${query}%`)
        .order('xp', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}
