import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DISCIPLINES,
  DEFAULT_FILTERS,
  RecruiterFiltersSchema,
  type RecruiterFilters,
} from '@/types/recruiter';

interface FiltersPanelProps {
  onChange: (filters: RecruiterFilters) => void;
}

const MIN_RANK_OPTIONS = ['Any', 'Journeyman+', 'Senior+', 'Master only'] as const;
const OPEN_TO_WORK_OPTIONS = ['Any', 'Open to work', 'Not looking'] as const;
const SORT_OPTIONS = ['Best fit', 'Most XP', 'Most recent', 'Most challenge wins'] as const;

export const FiltersPanel = ({ onChange }: FiltersPanelProps) => {
  const { register, watch, reset, setValue, getValues } = useForm<RecruiterFilters>({
    defaultValues: DEFAULT_FILTERS,
    resolver: zodResolver(RecruiterFiltersSchema),
  });

  const watched = watch();

  useEffect(() => {
    onChange(watched);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watched)]);

  const disciplines = watched.disciplines;

  const toggleDiscipline = (d: typeof DISCIPLINES[number]) => {
    const current = getValues('disciplines');
    if (current.includes(d)) {
      setValue('disciplines', current.filter(x => x !== d));
    } else {
      setValue('disciplines', [...current, d]);
    }
  };

  return (
    <Card className="bg-ide-sidebar border-border h-fit sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="font-mono text-xs text-muted-foreground">
          // filters.ts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Discipline */}
        <div className="space-y-2">
          <p className="font-mono text-xs text-syntax-comment">// discipline</p>
          <div className="space-y-1.5">
            {DISCIPLINES.map(d => (
              <div key={d} className="flex items-center gap-2">
                <Checkbox
                  id={`disc-${d}`}
                  checked={disciplines.includes(d)}
                  onCheckedChange={() => toggleDiscipline(d)}
                />
                <Label
                  htmlFor={`disc-${d}`}
                  className="font-mono text-xs text-foreground cursor-pointer"
                >
                  {d}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Min rank */}
        <div className="space-y-2">
          <p className="font-mono text-xs text-syntax-comment">// min_rank</p>
          <RadioGroup
            value={watched.minRank}
            onValueChange={v => setValue('minRank', v as RecruiterFilters['minRank'])}
            className="space-y-1.5"
          >
            {MIN_RANK_OPTIONS.map(opt => (
              <div key={opt} className="flex items-center gap-2">
                <RadioGroupItem value={opt} id={`rank-${opt}`} />
                <Label
                  htmlFor={`rank-${opt}`}
                  className="font-mono text-xs text-foreground cursor-pointer"
                >
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Must-have stack */}
        <div className="space-y-2">
          <p className="font-mono text-xs text-syntax-comment">// must_have_stack</p>
          <Input
            {...register('mustHaveStack')}
            placeholder="react, typescript, postgres"
            className="font-mono text-xs h-8"
          />
          <p className="font-mono text-xs text-muted-foreground">// comma-separated</p>
        </div>

        {/* Open to work */}
        <div className="space-y-2">
          <p className="font-mono text-xs text-syntax-comment">// open_to_work</p>
          <RadioGroup
            value={watched.openToWork}
            onValueChange={v => setValue('openToWork', v as RecruiterFilters['openToWork'])}
            className="space-y-1.5"
          >
            {OPEN_TO_WORK_OPTIONS.map(opt => (
              <div key={opt} className="flex items-center gap-2">
                <RadioGroupItem value={opt} id={`otw-${opt}`} />
                <Label
                  htmlFor={`otw-${opt}`}
                  className="font-mono text-xs text-foreground cursor-pointer"
                >
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Sort by */}
        <div className="space-y-2">
          <p className="font-mono text-xs text-syntax-comment">// sort_by</p>
          <RadioGroup
            value={watched.sortBy}
            onValueChange={v => setValue('sortBy', v as RecruiterFilters['sortBy'])}
            className="space-y-1.5"
          >
            {SORT_OPTIONS.map(opt => (
              <div key={opt} className="flex items-center gap-2">
                <RadioGroupItem value={opt} id={`sort-${opt}`} />
                <Label
                  htmlFor={`sort-${opt}`}
                  className="font-mono text-xs text-foreground cursor-pointer"
                >
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full font-mono text-xs text-muted-foreground"
          onClick={() => reset(DEFAULT_FILTERS)}
        >
          // clear filters
        </Button>
      </CardContent>
    </Card>
  );
};
