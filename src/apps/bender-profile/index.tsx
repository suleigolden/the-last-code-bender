import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileCode2, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IDEStatusBar } from '@/components/ide/IDEStatusBar';
import { SkillCard } from '@/components/profile/SkillCard';
import { ProfileExplorer } from '@/components/profile/ProfileExplorer';
import { useAuth } from '@/contexts/AuthContext';
import { useBenderByHandle } from '@/hooks/useBenders';
import { rowToBender } from '@/lib/bender-adapter';
import { useProfileWorkspace } from '@/hooks/useProfileWorkspace';
import { normalizeWorkspaceFiles } from '@/lib/profile-workspace-defaults';
import { workspaceHasRenderableFiles } from '@/lib/profile-workspace-sandpack';
import { cn } from '@/lib/utils';
import type { StackData } from '@/types/profile';
import { ForkRepositoryButton } from '@/apps/action-buttons/ ForkRepositoryButton';
import { IDEWindowControls } from '@/components/ide/IDEWindowControls';
import { supabase } from '@/lib/supabase';
import { CodeBenderPlaceholder } from '../codebender-profile-placeholder/CodeBenderPlaceholder';

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

function hashString(input: string) {
  // Small non-crypto hash for dedup keys.
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // 32-bit
  }
  return Math.abs(hash).toString(16);
}

function getDemoViewerFingerprint() {
  const key = 'demo_viewer_fingerprint';
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return null;
  }
}

// Build-time import map for all profile components.
// This avoids Vite's runtime "unknown variable dynamic import" errors.
type ProfileComponentModule = { default: React.ComponentType };

const PROFILE_COMPONENT_MODULES = import.meta.glob<ProfileComponentModule>(
  '../apps/codebender-profiles/**/index.tsx',
);

const ProfileWorkspacePreview = React.lazy(async () => {
  const m = await import('@/components/profile/ProfileWorkspacePreview');
  return { default: m.ProfileWorkspacePreview };
});

const FOUNDER_PROFILE_MODULE_KEY: string | undefined = Object.keys(PROFILE_COMPONENT_MODULES).find((k) =>
  k.toLowerCase().endsWith('/thelastcodebender/index.tsx'),
);

function findProfileModuleKey(disciplineFolder: string, handle: string) {
  const targetDiscipline = disciplineFolder.toLowerCase();
  const targetHandle = handle.toLowerCase();

  return Object.keys(PROFILE_COMPONENT_MODULES).find((key) => {
    // Expected pattern: ../apps/codebender-profiles/<DisciplineFolder>/<Handle>/index.tsx
    const parts = key.split('/');
    if (parts.length < 4) return false;
    const moduleDiscipline = parts[parts.length - 3]?.toLowerCase();
    const moduleHandle = parts[parts.length - 2]?.toLowerCase();
    return moduleDiscipline === targetDiscipline && moduleHandle === targetHandle;
  });
}

const DISCIPLINE_FOLDER: Record<string, string> = {
  frontend: 'FrontendBenders',
  backend: 'BackendBenders',
  fullstack: 'FullStackBenders',
  security: 'SecurityBenders',
  ai: 'AIBenders',
  devops: 'DevOpsBenders',
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
    <h2 className="text-xl font-bold text-foreground mb-2">Rank not yet registered</h2>
    <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
      This handle isn&apos;t in the registry yet. Sign in and contribute to register your rank, or
      browse the hall of fame for open slots.
    </p>
    <ForkRepositoryButton />
  </div>
);

export const BenderProfilePage = () => {
  const { discipline, handle } = useParams<{ discipline: string; handle: string }>();
  const { githubLogin } = useAuth();

  // Primary data source: Supabase
  const { data: benderRow, isLoading } = useBenderByHandle(handle ?? '');
  const bender = benderRow ? rowToBender(benderRow) : undefined;

  const demoUrl = benderRow?.demo_url ?? null;

  React.useEffect(() => {
    if (!demoUrl || !benderRow?.handle) return;

    const storageKey = `demo_viewed_${benderRow.handle}`;
    try {
      if (localStorage.getItem(storageKey)) return;
      const fingerprint = getDemoViewerFingerprint();
      if (!fingerprint) return;

      localStorage.setItem(storageKey, '1');

      // Fire-and-forget view tracking (deduped per browser+handle via localStorage).
      // NOTE: Supabase client typing can resolve table inserts as `never` if the
      // local `Database` type drifts from the generated schema shape.
      // Runtime behavior is correct; keep this non-blocking.
      void (supabase as unknown as { from: (t: string) => { insert: (v: unknown) => unknown } })
        .from('demo_views')
        .insert({
          handle: benderRow.handle,
          viewer_ip: hashString(fingerprint),
        });
    } catch {
      // Ignore view tracking failures (private browsing, storage disabled, etc.)
    }
  }, [demoUrl, benderRow?.handle]);

  void useQuery({
    queryKey: ['story', discipline, handle],
    queryFn: () =>
      fetch(`/codebenders/${discipline}/${handle}/story/README.md`).then((r) =>
        r.ok ? r.text() : null,
      ),
    enabled: !!bender,
  });

  void useQuery<StackData | null>({
    queryKey: ['stack', discipline, handle],
    queryFn: () =>
      fetch(`/codebenders/${discipline}/${handle}/stack/stack.json`).then((r) =>
        r.ok ? (r.json() as Promise<StackData>) : null,
      ),
    enabled: !!bender,
  });

  const isFounder =
    discipline?.toLowerCase() === 'founder' ||
    handle?.toLowerCase() === 'thelastcodebender';

  const hasComponent = isFounder
    ? !!FOUNDER_PROFILE_MODULE_KEY
    : !!(
        handle &&
        discipline &&
        DISCIPLINE_FOLDER[discipline.toLowerCase()] &&
        findProfileModuleKey(DISCIPLINE_FOLDER[discipline.toLowerCase()], handle)
      );

  const ProfileComponent = React.useMemo<React.LazyExoticComponent<React.ComponentType> | null>(() => {
    if (!hasComponent || !handle) return null;
    if (isFounder) {
      const founderKey = FOUNDER_PROFILE_MODULE_KEY;
      if (!founderKey) return null;
      return React.lazy(PROFILE_COMPONENT_MODULES[founderKey]);
    }
    const folder = DISCIPLINE_FOLDER[discipline?.toLowerCase() ?? ''];
    if (!folder) return null;

    const moduleKey = findProfileModuleKey(folder, handle);
    if (!moduleKey) return null;

    return React.lazy(PROFILE_COMPONENT_MODULES[moduleKey]);
  }, [hasComponent, isFounder, discipline, handle]);

  const shouldLoadWorkspace = Boolean(benderRow?.id);
  const { data: hostedWorkspace, isLoading: workspaceLoading } = useProfileWorkspace(
    shouldLoadWorkspace ? benderRow?.id : undefined,
  );

  const showHostedProfile =
    shouldLoadWorkspace &&
    !workspaceLoading &&
    hostedWorkspace != null &&
    workspaceHasRenderableFiles(hostedWorkspace.files);

  const hostedFiles = showHostedProfile && hostedWorkspace
    ? normalizeWorkspaceFiles(hostedWorkspace.files)
    : null;

  const disciplineDisplay = bender
    ? bender.discipline.charAt(0).toUpperCase() + bender.discipline.slice(1)
    : discipline ?? '';
  const disciplineColor =
    DISCIPLINE_COLORS[disciplineDisplay] ?? 'text-muted-foreground border-border';
  const rankColor = bender ? (RANK_COLORS[bender.rank] ?? 'bg-muted/60 text-muted-foreground') : '';
  const initials = bender?.handle[0]?.toUpperCase() ?? '?';

  const isOwnProfile = Boolean(
    githubLogin &&
      benderRow?.github_login &&
      githubLogin.toLowerCase() === benderRow.github_login.toLowerCase(),
  );

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
          <IDEWindowControls />
          <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-r border-l border-border text-syntax-function text-sm font-mono">
            <FileCode2 className="w-4 h-4 shrink-0" />
            <span>{handle ?? 'profile'}.profile.ts</span>
          </div>
        </div>

        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          <ProfileExplorer />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto">
              {isLoading && <SkeletonLayout />}

              {!isLoading && !bender && !hasComponent && <NotClaimedUI handle={handle} />}

              {(bender || hasComponent) && (
                <>
                  {/* Header */}
                  {bender && (
                    <div className="flex items-start gap-3 mb-6">
                      <div
                        className={cn(
                          'flex items-center justify-center w-12 h-12 rounded-full border font-mono font-bold text-lg shrink-0',
                          disciplineColor,
                        )}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="font-mono font-bold text-xl text-foreground truncate">
                          {bender.handle}
                        </h1>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <Badge
                            variant="outline"
                            className={cn('font-mono text-[10px] px-1.5 py-0 h-5 leading-none', disciplineColor)}
                          >
                            {disciplineDisplay}
                          </Badge>
                          <Badge className={cn('font-mono text-[10px] px-1.5 py-0 h-5 leading-none border-0', rankColor)}>
                            {bender.rank}
                          </Badge>
                          {bender.open_to_work && (
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] px-1.5 py-0 h-5 leading-none text-syntax-string border-syntax-string"
                            >
                              Open to work
                            </Badge>
                          )}
                          <span className="font-mono text-[10px] text-muted-foreground">{bender.xp} XP</span>
                        </div>
                        <div className="mt-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-1 px-0 h-7 font-mono text-[10px]"
                          >
                            <a
                              href={`https://github.com/${bender.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="w-3 h-3" />
                              @{bender.github}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Founder header (when no registry entry but has component) */}
                  {!bender && hasComponent && isFounder && (
                    <div className="flex items-start gap-3 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border font-mono font-bold text-lg shrink-0 text-primary border-primary">
                        T
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="font-mono font-bold text-xl text-foreground truncate">
                          {handle}
                        </h1>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] px-1.5 py-0 h-5 leading-none text-primary border-primary"
                          >
                            Founder
                          </Badge>
                          <Badge className="font-mono text-[10px] px-1.5 py-0 h-5 leading-none border-0 text-primary bg-primary/15">
                            Master Bender
                          </Badge>
                          <span className="font-mono text-[10px] text-muted-foreground">9999 XP</span>
                        </div>
                        <div className="mt-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-1 px-0 h-7 font-mono text-[10px]"
                          >
                            <a
                              href="https://github.com/suleigolden"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="w-3 h-3" />
                              @suleigolden
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hosted workspace (Supabase) > local profile component > tabs  style={{ border: '1px solid red' }} */}
                  {showHostedProfile && hostedFiles ? (
                    <React.Suspense fallback={<Skeleton className="h-96 w-full" />}>
                      <ProfileWorkspacePreview files={hostedFiles} />
                    </React.Suspense>
                  ) : ProfileComponent ? (
                    <React.Suspense fallback={<Skeleton className="h-96 w-full" />}>
                      <ProfileComponent />
                    </React.Suspense>
                  ) : (
                    <CodeBenderPlaceholder
                      codeBenderName={bender?.handle ?? handle ?? 'CodeBender'}
                      section="story"
                      isOwnProfile={isOwnProfile}
                    />
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
        </div>

        <IDEStatusBar activeFile="story" codeBenderName={bender?.handle} />
      </div>
    </div>
  );
};
