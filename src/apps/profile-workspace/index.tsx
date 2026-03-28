import { useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowDown, ArrowLeft, PenLine } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHasClaimedRank } from '@/hooks/useBenders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileWorkspaceEditor } from '@/components/profile/ProfileWorkspaceEditor';

export function ProfileWorkspacePage() {
  const { user, githubLogin, avatarUrl, signOut } = useAuth();
  const { data: existingBender, isLoading } = useHasClaimedRank(githubLogin);

  const scrollToEditor = useCallback(() => {
    document.getElementById('profile-workspace-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!isLoading && !existingBender) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-background noise-overlay">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-20" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="font-mono text-[15px] gap-1" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            </Button>
            <div>
              <p className="font-mono text-xs text-syntax-comment">// profile workspace</p>
              <h1 className="font-mono text-xl font-bold text-foreground mt-0.5">
                Edit your <span className="text-cyan-400">profile</span> sources
              </h1>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="font-mono text-xs" onClick={signOut}>
            Sign out
          </Button>
        </div>

        <Card className="mb-4 shrink-0 bg-ide-sidebar border-border">
          <CardContent className="p-4 flex items-center gap-3">
            {avatarUrl && (
              <img src={avatarUrl} alt={githubLogin ?? ''} className="w-9 h-9 rounded-full border border-border" />
            )}
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">@{githubLogin}</p>
              {existingBender && (
                <p className="font-mono text-[15px] text-muted-foreground">
                  {existingBender.handle} · {existingBender.discipline}
                </p>
              )}
              {!existingBender && <p className="font-mono text-xs text-muted-foreground">{user?.email}</p>}
            </div>
          </CardContent>
        </Card>

        {existingBender && !isLoading && (
          <Card className="mb-4 shrink-0 border-border bg-background/60">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <p className="font-mono text-xs text-syntax-comment">// workspace</p>
              <p className="font-mono text-sm text-foreground leading-relaxed">
                Nothing shows on your public profile until you <strong className="text-cyan-400">save</strong> here with a
                commit message. Edit your React profile, <span className="text-syntax-string">SKILL.md</span> (AI review +
                XP), and <span className="text-syntax-string">stack/stack.json</span> for recruiters. Add your demo from
                the <Link to="/dashboard" className="text-cyan-400 hover:underline">Dashboard</Link> showcase section.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" className="font-mono gap-1.5" onClick={scrollToEditor}>
                  <ArrowDown className="h-3.5 w-3.5 shrink-0" />
                  Jump to editor
                </Button>
                <Button type="button" size="sm" variant="secondary" className="font-mono gap-1.5" asChild>
                  <Link to="/dashboard">
                    <PenLine className="h-3.5 w-3.5 shrink-0" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <p className="flex flex-1 items-center justify-center font-mono text-sm text-syntax-comment animate-pulse">
            // loading workspace...
          </p>
        ) : (
          existingBender && (
            <div id="profile-workspace-editor" className="flex min-h-0 flex-1 flex-col scroll-mt-4">
              <ProfileWorkspaceEditor benderId={existingBender.id} handle={existingBender.handle} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
