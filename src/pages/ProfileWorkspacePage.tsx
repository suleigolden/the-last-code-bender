import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHasClaimedRank } from '@/hooks/useBenders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileWorkspaceEditor } from '@/components/profile/ProfileWorkspaceEditor';

export function ProfileWorkspacePage() {
  const { user, githubLogin, avatarUrl, signOut } = useAuth();
  const { data: existingBender, isLoading } = useHasClaimedRank(githubLogin);

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

        {isLoading ? (
          <p className="flex flex-1 items-center justify-center font-mono text-sm text-syntax-comment animate-pulse">
            // loading workspace...
          </p>
        ) : (
          existingBender && (
            <div className="flex min-h-0 flex-1 flex-col">
              <ProfileWorkspaceEditor benderId={existingBender.id} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
