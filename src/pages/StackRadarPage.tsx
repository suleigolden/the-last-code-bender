import { useState, useMemo } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useRadar } from '@/hooks/useRegistry';
import { RadarQuadrant } from '@/components/radar/RadarQuadrant';
import { TechPill } from '@/components/radar/TechPill';
import type { RadarMovement } from '@/types/registry';

const CHART_CATEGORIES = ['Languages', 'Frameworks', 'Databases', 'DevOps', 'Testing', 'CSS'];
const CATEGORY_KEY_MAP: Record<string, string> = {
  language:  'Languages',
  framework: 'Frameworks',
  database:  'Databases',
  devops:    'DevOps',
  testing:   'Testing',
  css:       'CSS',
};

const QUADRANT_META = {
  adopt:  { label: 'Adopt',  color: 'text-green-400' },
  trial:  { label: 'Trial',  color: 'text-blue-400' },
  assess: { label: 'Assess', color: 'text-amber-400' },
  hold:   { label: 'Hold',   color: 'text-red-400' },
};

const DISCIPLINES = ['All', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'Data'];

function MovementRow({ movement }: { movement: RadarMovement }) {
  const fromMeta = QUADRANT_META[movement.from as keyof typeof QUADRANT_META];
  const toMeta   = QUADRANT_META[movement.to   as keyof typeof QUADRANT_META];

  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <TechPill
        tech={movement.tech}
        category={movement.category}
        benderCount={0}
      />
      <span className={fromMeta?.color ?? 'text-muted-foreground'}>{fromMeta?.label ?? movement.from}</span>
      <ArrowRight className="w-3 h-3 text-muted-foreground" />
      <span className={toMeta?.color ?? 'text-muted-foreground'}>{toMeta?.label ?? movement.to}</span>
    </div>
  );
}

export function StackRadarPage() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [discipline, setDiscipline] = useState('All');
  const { data: radar, isLoading } = useRadar();

  function handleTechClick(tech: string) {
    setSelectedTech(prev => (prev === tech ? null : tech));
  }

  const chartData = useMemo(() => {
    if (!radar) return CHART_CATEGORIES.map(c => ({ category: c, total: 0, selected: 0 }));

    const totals: Record<string, number> = {};
    const seenTechs = new Set<string>();

    for (const items of Object.values(radar.positions)) {
      for (const entry of items) {
        if (seenTechs.has(entry.tech)) continue;
        seenTechs.add(entry.tech);
        const key = CATEGORY_KEY_MAP[entry.category];
        if (key) totals[key] = (totals[key] ?? 0) + entry.bender_count;
      }
    }

    const selectedEntry = selectedTech
      ? Object.values(radar.positions).flat().find(e => e.tech === selectedTech)
      : null;

    return CHART_CATEGORIES.map(c => ({
      category: c,
      total: totals[c] ?? 0,
      selected:
        selectedEntry && CATEGORY_KEY_MAP[selectedEntry.category] === c
          ? selectedEntry.bender_count
          : 0,
    }));
  }, [radar, selectedTech]);

  const chartConfig = {
    total:    { label: 'All Benders',          color: 'hsl(var(--primary))' },
    selected: { label: selectedTech ?? 'Selected', color: 'hsl(var(--syntax-string))' },
  };

  const movements = radar?.movements ?? [];

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        {/* IDE Tab Bar */}
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 mr-4 pl-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <Activity className="w-4 h-4 shrink-0" />
            <span>STACK_RADAR.ts</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-mono font-bold text-foreground">
                  <span className="text-syntax-keyword">const</span>{' '}
                  <span className="text-syntax-function">stackRadar</span>{' '}
                  <span className="text-muted-foreground">=</span>{' '}
                  <span className="text-syntax-string">
                    &apos;live tech from {radar?.total_benders ?? '…'} CodeBenders&apos;
                  </span>
                </h1>
                {radar && (
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {'// generated_at: '}
                    {new Date(radar.generated_at).toLocaleString()}
                  </p>
                )}
              </div>
              <Select value={discipline} onValueChange={setDiscipline}>
                <SelectTrigger className="w-40 font-mono text-xs shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISCIPLINES.map(d => (
                    <SelectItem key={d} value={d} className="font-mono text-xs">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-lg" />
                  ))}
                </div>
                <Skeleton className="h-72 rounded-lg" />
              </div>
            ) : (
              <>
                {/* Quadrant grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['adopt', 'trial', 'assess', 'hold'] as const).map(pos => (
                    <RadarQuadrant
                      key={pos}
                      position={pos}
                      techs={radar?.positions[pos] ?? []}
                      selectedTech={selectedTech}
                      onTechClick={handleTechClick}
                    />
                  ))}
                </section>

                {/* Spider chart */}
                <section className="bg-ide-sidebar border border-border rounded-lg p-6">
                  <h2 className="font-mono text-sm text-muted-foreground mb-4">
                    {'// Category distribution'}
                    {selectedTech ? ` — ${selectedTech} highlighted` : ''}
                  </h2>
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
                          name="total"
                          dataKey="total"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.15}
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                        {selectedTech && (
                          <Radar
                            name="selected"
                            dataKey="selected"
                            fill="transparent"
                            stroke="hsl(var(--syntax-string))"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                          />
                        )}
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </section>

                {/* Trend / movements */}
                <section>
                  <h2 className="font-mono text-sm text-muted-foreground mb-3">
                    {'// Recently moved'}
                  </h2>
                  {movements.length === 0 ? (
                    <p className="font-mono text-xs text-muted-foreground/50">
                      {'// No position changes since last run.'}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {movements.map(m => (
                        <MovementRow key={m.tech} movement={m} />
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

          </div>
        </main>

        <IDEStatusBar activeFile="story" />
      </div>
    </div>
  );
}
