import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileCode2, Github } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { SkillCard } from '@/components/profile/SkillCard';
import { DemoFrame } from '@/components/profile/DemoFrame';
import { StackBadges } from '@/components/profile/StackBadges';
import { useRegistry } from '@/hooks/useRegistry';
import { cn } from '@/lib/utils';
import type { StackData } from '@/types/profile';
import { ForkRepositoryButton } from '@/apps/action-buttons/ ForkRepositoryButton';
import { StoryRenderer } from '@/components/profile/StoryRenderer';
import { BENDER_PROFILES } from '@/codebender-profiles/registry';

const DISCIPLINE_COLORS: Record<string, string> = {
  Frontend: 'text-syntax-keyword border-syntax-keyword',
  Backend: 'text-syntax-function border-syntax-function',
  FullStack: 'text-syntax-string border-syntax-string',
  Security: 'text-syntax-variable border-syntax-variable',
  AI: 'text-primary border-primary',
  DevOps: 'text-muted-foreground border-border',
};

const RANK_COLORS: Record<string, string> = {
  Apprentice: 'bg-muted/60 text-muted-foreground',
  Journeyman: 'text-syntax-string bg-[hsl(95_60%_55%/0.15)]',
  Senior: 'text-syntax-function bg-[hsl(35_90%_65%/0.15)]',
  Master: 'text-primary bg-primary/15',
};

const DISCIPLINE_FOLDER: Record<string, string> = {
  frontend: 'Frontend Bender',
  backend: 'Backend Bender',
  fullstack: 'FullStack Bender',
  security: 'Security Bender',
  ai: 'AI Bender',
  devops: 'DevOps Bender',
};

const SkeletonLayout = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <Skeleton className="h-64 w-full mt-6" />
  </div>
);

const NotClaimedUI = ({ handle }: { handle: string | undefined }) => (
  <div className="text-center py-16 font-mono">
    <p className="text-muted-foreground text-sm mb-4">// {handle ?? 'unknown'}.profile.ts</p>
    <h2 className="text-xl font-bold text-foreground mb-2">Rank not yet claimed</h2>
    <p className="text-muted-foreground text-sm mb-6">
      This handle hasn&apos;t been registered yet. Be the first to claim it.
    </p>
    <ForkRepositoryButton />
  </div>
);

export const BenderProfilePage = () => {
  const { discipline, handle } = useParams<{ discipline: string; handle: string }>();
  const { data: registry, isLoading } = useRegistry();

  const bender = registry?.find(
    (b) =>
      b.handle.toLowerCase() === handle?.toLowerCase() &&
      b.discipline.toLowerCase() === discipline?.toLowerCase(),
  );

  const { data: story, isLoading: storyLoading } = useQuery({
    queryKey: ['story', discipline, handle],
    queryFn: () =>
      fetch(`/codebenders/${discipline}/${handle}/story/README.md`).then((r) =>
        r.ok ? r.text() : null,
      ),
    enabled: !!bender,
  });

  const { data: stackData, isLoading: stackLoading } = useQuery<StackData | null>({
    queryKey: ['stack', discipline, handle],
    queryFn: () =>
      fetch(`/codebenders/${discipline}/${handle}/stack/stack.json`).then((r) =>
        r.ok ? (r.json() as Promise<StackData>) : null,
      ),
    enabled: !!bender,
  });

  const profileEntry = BENDER_PROFILES.find(
    (p) => p.handle.toLowerCase() === handle?.toLowerCase(),
  );
  const isFounder = profileEntry?.isFounder === true;
  const hasComponent = !!profileEntry && !profileEntry.isPlaceholder;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ProfileComponent = React.useMemo<React.LazyExoticComponent<any> | null>(() => {
    if (!hasComponent || !handle) return null;
    if (isFounder) {
      return React.lazy(() => import('@/codebender-profiles/TheLastCodeBender'));
    }
    const folder = DISCIPLINE_FOLDER[discipline?.toLowerCase() ?? ''];
    if (!folder) return null;
    return React.lazy(() => import(`@/codebender-profiles/${folder}/${handle}/index.tsx`));
  }, [hasComponent, isFounder, discipline, handle]);

  const disciplineDisplay = bender
    ? bender.discipline.charAt(0).toUpperCase() + bender.discipline.slice(1)
    : discipline ?? '';
  const disciplineColor =
    DISCIPLINE_COLORS[disciplineDisplay] ?? 'text-muted-foreground border-border';
  const rankColor = bender ? (RANK_COLORS[bender.rank] ?? 'bg-muted/60 text-muted-foreground') : '';
  const initials = bender?.handle[0]?.toUpperCase() ?? '?';

  if (handle === 'codebender-profile-placeholder') {
    return <Navigate to="/hall-of-fame" replace />;
  }

  return (
    <div className="h-screen bg-background flex flex-col noise-overlay relative overflow-hidden">
      {/* IDE Grid Background */}
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-30" />

      <div className="flex flex-1 flex-col relative z-10 h-full overflow-hidden">
        {/* Mini tab bar */}
        <div className="flex items-center bg-ide-tabbar border-b border-border px-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 mr-4 pl-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <FileCode2 className="w-4 h-4 shrink-0" />
            <span>{handle ?? 'profile'}.profile.ts</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {isLoading && <SkeletonLayout />}

            {!isLoading && !bender && !hasComponent && <NotClaimedUI handle={handle} />}

            {(bender || hasComponent) && (
              <>
                {/* Header */}
                {bender && (
                  <div className="flex items-start gap-4 mb-8">
                    <div
                      className={cn(
                        'flex items-center justify-center w-16 h-16 rounded-full border-2 font-mono font-bold text-xl shrink-0',
                        disciplineColor,
                      )}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="font-mono font-bold text-2xl text-foreground truncate">
                        {bender.handle}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge variant="outline" className={cn('font-mono text-xs', disciplineColor)}>
                          {disciplineDisplay}
                        </Badge>
                        <Badge className={cn('font-mono text-xs border-0', rankColor)}>
                          {bender.rank}
                        </Badge>
                        {bender.open_to_work && (
                          <Badge variant="outline" className="font-mono text-xs text-syntax-string border-syntax-string">
                            Open to work
                          </Badge>
                        )}
                        <span className="font-mono text-xs text-muted-foreground">{bender.xp} XP</span>
                      </div>
                      <div className="mt-2">
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 px-0 font-mono text-xs">
                          <a
                            href={`https://github.com/${bender.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-3.5 h-3.5" />
                            @{bender.github}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Founder header (when no registry entry but has component) */}
                {!bender && hasComponent && isFounder && (
                  <div className="flex items-start gap-4 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 font-mono font-bold text-xl shrink-0 text-primary border-primary">
                      T
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="font-mono font-bold text-2xl text-foreground truncate">
                        {handle}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="font-mono text-xs text-primary border-primary">
                          Founder
                        </Badge>
                        <Badge className="font-mono text-xs border-0 text-primary bg-primary/15">
                          Master Bender
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">9999 XP</span>
                      </div>
                      <div className="mt-2">
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 px-0 font-mono text-xs">
                          <a
                            href="https://github.com/suleigolden"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-3.5 h-3.5" />
                            @suleigolden
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile component or tabs */}
                {ProfileComponent ? (
                  <React.Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <ProfileComponent />
                  </React.Suspense>
                ) : (
                  <Tabs defaultValue="story">
                    <TabsList className="font-mono mb-6">
                      <TabsTrigger value="story">Story</TabsTrigger>
                      <TabsTrigger value="stack">Stack</TabsTrigger>
                      <TabsTrigger value="showcase">Showcase</TabsTrigger>
                      <TabsTrigger value="challenges">Challenges</TabsTrigger>
                    </TabsList>

                    {/* Story */}
                    <TabsContent value="story">
                      {storyLoading ? (
                        <Skeleton className="h-48 w-full" />
                      ) : story ? (
                        <div className="bg-ide-sidebar border border-border rounded-lg p-4">
                          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
                            <span className="text-xs font-mono text-muted-foreground">story/README.md</span>
                            <span className="text-xs text-syntax-comment font-mono">— Preview</span>
                          </div>
                          <StoryRenderer markdown={story} />
                        </div>
                      ) : (
                        <p className="font-mono text-sm text-muted-foreground">
                          // No story yet
                        </p>
                      )}
                    </TabsContent>

                    {/* Stack */}
                    <TabsContent value="stack">
                      {stackLoading ? (
                        <Skeleton className="h-48 w-full" />
                      ) : stackData ? (
                        <StackBadges data={stackData} />
                      ) : (
                        <p className="font-mono text-sm text-muted-foreground">
                          // Stack not yet added
                        </p>
                      )}
                    </TabsContent>

                    {/* Showcase */}
                    <TabsContent value="showcase">
                      <DemoFrame url={bender?.demo_url ?? null} views={bender?.demo_views ?? 0} />
                    </TabsContent>

                    {/* Challenges */}
                    <TabsContent value="challenges">
                      {(bender?.challenge_wins ?? 0) > 0 ? (
                        <div className="font-mono text-sm">
                          <p className="text-muted-foreground mb-4">
                            // Challenge wins: {bender?.challenge_wins}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-sm px-3 py-1">
                              🏆 {bender?.challenge_wins}{' '}
                              {bender?.challenge_wins === 1 ? 'win' : 'wins'}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <p className="font-mono text-sm text-muted-foreground">
                          // No challenge wins yet — check the{' '}
                          <a href="/challenges" className="text-primary underline underline-offset-2">
                            challenges page
                          </a>
                          .
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                )}

                {/* Skill Card */}
                {bender && (
                  <SkillCard
                    handle={bender.handle}
                    xp={bender.xp}
                    skillLive={bender.skill_live}
                  />
                )}
              </>
            )}
          </div>
        </main>

        <IDEStatusBar activeFile="story" codeBenderName={bender?.handle} />
      </div>
    </div>
  );
};
