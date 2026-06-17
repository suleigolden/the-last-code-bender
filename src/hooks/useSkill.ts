import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { benderKeys } from '@/hooks/useBenders';

export function useSubmitSkillReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      handle,
      skillContent,
      stackContent,
    }: {
      handle: string;
      skillContent: string;
      stackContent: string;
    }) =>
      api.post<{ approved: boolean; verdict: string }>('/api/skills/review', {
        handle,
        skill_content: skillContent,
        stack_content: stackContent,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: benderKeys.all });
      queryClient.invalidateQueries({ queryKey: benderKeys.byHandle(variables.handle) });
    },
  });
}
