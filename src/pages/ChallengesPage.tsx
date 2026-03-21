import { FileJson, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { activeChallenges, completedChallenges } from '@/data/challenges';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import leaderboardData from '../../registry/leaderboard.json';

type LeaderboardEntry = {
  position: number;
  handle: string;
  discipline: string;
  rank: string;
  xp: number;
};

const chartConfig = {
  xp: {
    label: 'XP',
    color: 'hsl(var(--primary))',
  },
};

const topEntries: LeaderboardEntry[] = [...(leaderboardData.entries as LeaderboardEntry[])]
  .sort((a, b) => b.xp - a.xp)
  .slice(0, 10);

export const ChallengesPage = () => {
  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      {/* IDE Grid Background */}
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        {/* IDE Tab Bar */}
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          {/* Window controls */}
          <div className="hidden lg:flex items-center gap-1.5 mr-4 pl-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          {/* Active tab */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <FileJson className="w-4 h-4 shrink-0" />
            <span>CHALLENGES.json</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-mono font-bold text-foreground">
                <span className="text-syntax-keyword">const</span>{' '}
                <span className="text-syntax-function">challenges</span>{' '}
                <span className="text-muted-foreground">=</span>{' '}
                <span className="text-syntax-string">"earn your XP"</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Submit solutions, get AI-judged, climb the leaderboard.
              </p>
            </div>

            <Tabs defaultValue="active">
              <TabsList className="font-mono mb-6">
                <TabsTrigger value="active" className="gap-2">
                  Active
                  {activeChallenges.length > 0 && (
                    <Badge variant="default" className="text-xs px-1.5 py-0 h-4">
                      {activeChallenges.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="leaderboard" className="gap-2">
                  <Trophy className="w-3.5 h-3.5" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              {/* Active Challenges */}
              <TabsContent value="active">
                {activeChallenges.length === 0 ? (
                  <p className="text-muted-foreground font-mono text-sm">
                    // No active challenges right now. Check back soon.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeChallenges.map((c) => (
                      <ChallengeCard key={c.id} challenge={c} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Completed Challenges */}
              <TabsContent value="completed">
                {completedChallenges.length === 0 ? (
                  <p className="text-muted-foreground font-mono text-sm">
                    // No completed challenges yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {completedChallenges.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-4 rounded-md border border-border bg-ide-sidebar font-mono text-sm"
                      >
                        <div>
                          <span className="text-foreground font-semibold">{c.title}</span>
                          {c.winner && (
                            <span className="ml-3 text-syntax-string text-xs">
                              Winner: @{c.winner}
                              {c.winnerScore !== undefined && ` — ${c.winnerScore}/100`}
                            </span>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">Completed</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Leaderboard */}
              <TabsContent value="leaderboard">
                <div className="rounded-md border border-border bg-ide-sidebar p-6">
                  <h2 className="font-mono text-sm text-muted-foreground mb-4">
                    // Top {topEntries.length} by XP · snapshot:{' '}
                    {new Date(leaderboardData.snapshot_at).toLocaleDateString()}
                  </h2>

                  {topEntries.length === 0 ? (
                    <p className="text-muted-foreground font-mono text-sm">
                      // No entries yet.
                    </p>
                  ) : (
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topEntries}
                          layout="vertical"
                          margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
                        >
                          <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                          <YAxis
                            type="category"
                            dataKey="handle"
                            width={160}
                            tick={{ fontSize: 11, fontFamily: 'monospace' }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="xp" fill="var(--color-xp)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Status Bar — use "socials" as workaround to show JSON file type */}
        <IDEStatusBar activeFile="socials" />
      </div>
    </div>
  );
};
