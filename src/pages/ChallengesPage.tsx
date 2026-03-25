import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileJson, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useChallenges, useMySubmissions, useLeaderboard, useHasClaimedRank } from '@/hooks/useBenders';
import { useProfileWorkspace } from '@/hooks/useProfileWorkspace';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

import { Progress } from '@/components/ui/progress';
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

import type { ChallengeRow, LeaderboardRow } from '@/types/database';

const chartConfig = {
  xp: {
    label: 'XP',
    color: 'hsl(var(--primary))',
  },
};

const typeLabel: Record<string, string> = {
  weekly_sprint: 'Weekly Sprint',
  monthly_build: 'Monthly Build',
  skill_duel: 'Skill Duel',
  architecture: 'Architecture',
  relay: 'Relay',
};

const badgeVariant: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  weekly_sprint: 'default',
  monthly_build: 'secondary',
  skill_duel: 'destructive',
  architecture: 'outline',
  relay: 'outline',
};

type JudgeResult = {
  approved: boolean;
  score: { correctness: number; performance: number; style: number; total: number };
  feedback: { correctness: string; performance: string; style: string };
};

const LANGUAGE_OPTIONS = ['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'csharp'] as const;

function isLanguageOption(value: string): value is (typeof LANGUAGE_OPTIONS)[number] {
  return (LANGUAGE_OPTIONS as readonly string[]).includes(value);
}

export const ChallengesPage = () => {
  const { githubLogin } = useAuth();

  const { data: myBender, isLoading: loadingBender } = useHasClaimedRank(githubLogin);
  const { data: workspace } = useProfileWorkspace(myBender?.id);

  const stackJson = useMemo(() => {
    const raw = workspace?.files?.['stack/stack.json'];
    return typeof raw === 'string' ? raw : '';
  }, [workspace?.files]);

  const stackParsed = useMemo(() => {
    if (!stackJson.trim()) return null;
    try {
      return JSON.parse(stackJson) as unknown;
    } catch {
      return null;
    }
  }, [stackJson]);

  const { data: challenges, isLoading: loadingChallenges } = useChallenges();
  const activeChallenges = (challenges ?? []).filter((c) => c.is_active);
  const completedChallenges = (challenges ?? []).filter((c) => !c.is_active);

  const { data: leaderboardRows, isLoading: loadingLeaderboard } = useLeaderboard();
  const topEntries: LeaderboardRow[] = useMemo(() => {
    const rows = leaderboardRows ?? [];
    return [...rows].sort((a, b) => b.xp - a.xp).slice(0, 10);
  }, [leaderboardRows]);

  const { refetch } = useMySubmissions(githubLogin ?? '');

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ChallengeRow | null>(null);
  const [language, setLanguage] = useState<(typeof LANGUAGE_OPTIONS)[number]>('typescript');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);

  const openForChallenge = (c: ChallengeRow) => {
    setSelected(c);
    setOpen(true);
    setContent('');
    setJudgeResult(null);
    setLanguage('typescript');
  };

  const handleSubmit = async () => {
    if (!selected || !githubLogin) return;
    if (!content.trim()) {
      toast.error('Submission content is required.');
      return;
    }

    setIsSubmitting(true);
    setJudgeResult(null);

    try {
      // Insert submission row first (RLS enforces ownership via github field)
      const { data: inserted, error: insertError } = await supabase
        .from('challenge_submissions')
        .insert({
          challenge_id: selected.id,
          challenge_slug: selected.slug,
          handle: githubLogin,
          github: githubLogin,
          content: content,
          language,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      if (!inserted?.id) throw new Error('Failed to create submission');

      const { data: judged, error: invokeError } = await supabase.functions.invoke('judge-challenge', {
        body: {
          submission_id: inserted.id,
          handle: githubLogin,
          content,
          challenge_slug: selected.slug,
          stack: stackParsed ?? stackJson,
        },
      });

      if (invokeError) throw invokeError;

      const result = judged as JudgeResult;
      setJudgeResult(result);

      // Refresh submissions list (placement/feedback)
      refetch();
      toast.success('Submission judged.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Submit failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 mr-4 pl-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <FileJson className="w-4 h-4 shrink-0" />
            <span>CHALLENGES</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
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

              <TabsContent value="active">
                {loadingChallenges ? (
                  <p className="text-muted-foreground font-mono text-sm">// loading challenges...</p>
                ) : activeChallenges.length === 0 ? (
                  <p className="text-muted-foreground font-mono text-sm">
                    // No active challenges right now. Check back soon.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeChallenges.map((c) => (
                      <Card
                        key={c.id}
                        className="flex flex-col bg-ide-sidebar border-border hover:border-primary/40 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant={badgeVariant[c.type] ?? 'outline'} className="text-xs shrink-0">
                              {typeLabel[c.type] ?? c.type}
                            </Badge>
                            <span className="text-xs text-syntax-string font-mono">
                              Ends {formatDistanceToNow(new Date(c.closes_at), { addSuffix: true })}
                            </span>
                          </div>
                          <CardTitle className="text-base font-mono text-foreground mt-2">{c.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">{c.spec}</p>
                          <div className="grid grid-cols-3 gap-1 text-xs font-mono text-muted-foreground pt-1">
                            <span>
                              Correctness <span className="text-foreground">/{c.scoring.correctness ?? 40}</span>
                            </span>
                            <span>
                              Perf <span className="text-foreground">/{c.scoring.performance ?? 30}</span>
                            </span>
                            <span>
                              Style <span className="text-foreground">/{c.scoring.style ?? 30}</span>
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 pt-4">
                          <div className="w-full text-xs font-mono text-muted-foreground">
                            XP: <span className="text-syntax-string">+{c.xp_winner}</span> winner ·{' '}
                            <span className="text-syntax-string">+{c.xp_submit}</span> participant
                          </div>
                          <Button
                            size="sm"
                            className="w-full font-mono text-xs"
                            onClick={() => openForChallenge(c)}
                            disabled={!githubLogin || loadingBender}
                          >
                            Submit entry
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {loadingChallenges ? (
                  <p className="text-muted-foreground font-mono text-sm">// loading challenges...</p>
                ) : completedChallenges.length === 0 ? (
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
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="leaderboard">
                <div className="rounded-md border border-border bg-ide-sidebar p-6">
                  <h2 className="font-mono text-sm text-muted-foreground mb-4">// Top 10 by XP</h2>

                  {loadingLeaderboard ? (
                    <p className="text-muted-foreground font-mono text-sm">// loading leaderboard...</p>
                  ) : topEntries.length === 0 ? (
                    <p className="text-muted-foreground font-mono text-sm">// No entries yet.</p>
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="font-mono sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {selected ? selected.title : 'Challenge submission'}
              </DialogTitle>
              <DialogDescription>
                Submit your entry. The AI judge will score it and award XP.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground">Language</label>
                <div className="flex-1">
                  <Select
                    value={language}
                    onValueChange={(v) => {
                      if (isLanguageOption(v)) setLanguage(v);
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Textarea
                placeholder="Paste your solution code/text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                disabled={isSubmitting}
              />

              {judgeResult && (
                <div className="rounded-md border border-border bg-background/30 p-3 space-y-2">
                  <p className="text-xs text-syntax-comment">// AI score breakdown</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Correctness</span>
                    <span className="text-xs text-foreground font-mono">{judgeResult.score.correctness}/40</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Performance</span>
                    <span className="text-xs text-foreground font-mono">{judgeResult.score.performance}/30</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Style</span>
                    <span className="text-xs text-foreground font-mono">{judgeResult.score.style}/30</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-xs text-foreground font-mono">{judgeResult.score.total}/100</span>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                    {judgeResult.feedback?.correctness ? `- ${judgeResult.feedback.correctness}` : null}
                    {judgeResult.feedback?.performance ? `\n- ${judgeResult.feedback.performance}` : null}
                    {judgeResult.feedback?.style ? `\n- ${judgeResult.feedback.style}` : null}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" className="font-mono" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button className="font-mono" disabled={!selected || isSubmitting || !githubLogin} onClick={handleSubmit}>
                {isSubmitting ? 'Judging…' : 'Submit entry'}
              </Button>
            </DialogFooter>

            {isSubmitting && (
              <div className="mt-2">
                <Progress value={50} className="h-1.5" />
              </div>
            )}
          </DialogContent>
        </Dialog>

        <IDEStatusBar activeFile="socials" />
      </div>
    </div>
  );
};
