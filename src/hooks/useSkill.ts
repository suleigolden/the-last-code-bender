import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { benderKeys } from '@/hooks/useBenders';

export function useSubmitSkillReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      handle,
      skillContent,
      stackContent,
    }: {
      handle: string;
      skillContent: string;
      stackContent: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('review-skill', {
        body: {
          handle,
          skill_content: skillContent,
          stack_content: stackContent,
        },
      });
      if (error) throw error;
      return data as { approved: boolean; verdict: string };
    },
    onSuccess: (_data, variables) => {
      // Refresh any UI that depends on bender profile fields (rank, skill_live, xp, etc.)
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
      queryClient.invalidateQueries({ queryKey: benderKeys.byHandle(variables.handle) });
    },
  });
}

