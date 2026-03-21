import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { CompatResult as CompatResultType } from '@/lib/compatibility';
import type { Bender } from '@/types/registry';
import type { StackData } from '@/types/profile';

const DISCIPLINE_COLORS: Record<string, string> = {
  Frontend: 'text-syntax-keyword border-syntax-keyword',
  Backend: 'text-syntax-function border-syntax-function',
  FullStack: 'text-syntax-string border-syntax-string',
  Security: 'text-syntax-variable border-syntax-variable',
  AI: 'text-primary border-primary',
  DevOps: 'text-muted-foreground border-border',
};

const RADAR_AXES = ['Languages', 'Frameworks', 'Databases', 'DevOps', 'Other'] as const;
const CATEGORY_MAP: Record<string, string> = {
  language: 'Languages',
  framework: 'Frameworks',
  db: 'Databases',
  devops: 'DevOps',
  other: 'Other',
};

function scoreBg(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function buildRadarData(stackA: StackData | null, stackB: StackData | null) {
  const countByCategory = (stack: StackData | null, axisLabel: string) => {
    if (!stack) return 0;
    return stack.primary.filter(item => CATEGORY_MAP[item.category] === axisLabel).length;
  };

  return RADAR_AXES.map(axis => ({
    category: axis,
    A: countByCategory(stackA, axis),
    B: countByCategory(stackB, axis),
  }));
}

interface CompatResultProps {
  result: CompatResultType;
  benderA: Bender;
  benderB: Bender;
  stackA: StackData | null;
  stackB: StackData | null;
}

export function CompatResult({ result, benderA, benderB, stackA, stackB }: CompatResultProps) {
  const colorA = DISCIPLINE_COLORS[benderA.discipline] ?? 'text-muted-foreground border-border';
  const colorB = DISCIPLINE_COLORS[benderB.discipline] ?? 'text-muted-foreground border-border';

  const chartData = buildRadarData(stackA, stackB);

  const chartConfig = {
    A: { label: benderA.handle, color: 'hsl(var(--primary))' },
    B: { label: benderB.handle, color: 'hsl(var(--syntax-string))' },
  };

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <div className="bg-ide-sidebar border border-border rounded-lg p-6 text-center">
        <p className="font-mono text-xs text-muted-foreground mb-1">// compatibility.overall</p>
        <p className={cn('font-mono font-bold text-6xl', scoreBg(result.overall))}>
          {result.overall}
        </p>
        <p className="font-mono text-sm text-muted-foreground mt-2">{result.summary}</p>
      </div>

      {/* Sub-scores */}
      <div className="bg-ide-sidebar border border-border rounded-lg p-6 space-y-4">
        <p className="font-mono text-xs text-muted-foreground">// sub_scores</p>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-foreground">Language Overlap</span>
            <span className="text-muted-foreground">{result.languageOverlap}%</span>
          </div>
          <Progress value={result.languageOverlap} className="h-2" />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-foreground">Tooling Compat</span>
            <span className="text-muted-foreground">{result.toolingCompat}%</span>
          </div>
          <Progress value={result.toolingCompat} className="h-2" />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-foreground">Gap Coverage</span>
            <span className="text-muted-foreground">{result.gapCoverage}%</span>
          </div>
          <Progress value={result.gapCoverage} className="h-2" />
        </div>
      </div>

      {/* Tech breakdown */}
      <div className="bg-ide-sidebar border border-border rounded-lg p-6">
        <p className="font-mono text-xs text-muted-foreground mb-4">// tech_breakdown</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Shared */}
          <div>
            <p className="font-mono text-xs text-muted-foreground mb-2">shared</p>
            <div className="flex flex-wrap gap-1.5">
              {result.sharedTechs.length === 0 ? (
                <span className="font-mono text-xs text-muted-foreground/50">none</span>
              ) : result.sharedTechs.map(t => (
                <Badge
                  key={t}
                  variant="outline"
                  className="font-mono text-xs bg-green-500/20 text-green-400 border-green-500/40"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* A only */}
          <div>
            <p className={cn('font-mono text-xs mb-2', colorA)}>{benderA.handle} only</p>
            <div className="flex flex-wrap gap-1.5">
              {result.aOnlyTechs.length === 0 ? (
                <span className="font-mono text-xs text-muted-foreground/50">none</span>
              ) : result.aOnlyTechs.map(t => (
                <Badge key={t} variant="outline" className={cn('font-mono text-xs', colorA)}>
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* B only */}
          <div>
            <p className={cn('font-mono text-xs mb-2', colorB)}>{benderB.handle} only</p>
            <div className="flex flex-wrap gap-1.5">
              {result.bOnlyTechs.length === 0 ? (
                <span className="font-mono text-xs text-muted-foreground/50">none</span>
              ) : result.bOnlyTechs.map(t => (
                <Badge key={t} variant="outline" className={cn('font-mono text-xs', colorB)}>
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RadarChart */}
      <div className="bg-ide-sidebar border border-border rounded-lg p-6">
        <p className="font-mono text-xs text-muted-foreground mb-4">// primary_stack_radar</p>
        <div className="flex gap-4 mb-3 font-mono text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-primary" />
            {benderA.handle}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5" style={{ backgroundColor: 'hsl(var(--syntax-string))' }} />
            {benderB.handle}
          </span>
        </div>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ResponsiveContainer>
            <RadarChart data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontFamily: 'monospace', fontSize: 11 }}
              />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar
                name="A"
                dataKey="A"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Radar
                name="B"
                dataKey="B"
                fill="hsl(var(--syntax-string))"
                fillOpacity={0.2}
                stroke="hsl(var(--syntax-string))"
                strokeWidth={2}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
