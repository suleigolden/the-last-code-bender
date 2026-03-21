import { z } from 'zod';

export const DISCIPLINES = ['Frontend', 'Backend', 'FullStack', 'Security', 'AI', 'DevOps'] as const;

export const RecruiterFiltersSchema = z.object({
  disciplines:   z.array(z.enum(DISCIPLINES)).default([]),
  minRank:       z.enum(['Any', 'Journeyman+', 'Senior+', 'Master only']).default('Any'),
  mustHaveStack: z.string().default(''),
  openToWork:    z.enum(['Any', 'Open to work', 'Not looking']).default('Any'),
  sortBy:        z.enum(['Best fit', 'Most XP', 'Most recent', 'Most challenge wins']).default('Best fit'),
});

export type RecruiterFilters = z.infer<typeof RecruiterFiltersSchema>;
export const DEFAULT_FILTERS: RecruiterFilters = RecruiterFiltersSchema.parse({});
