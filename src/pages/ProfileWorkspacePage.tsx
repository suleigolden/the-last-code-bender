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
    <div className="min-h-screen bg-background noise-overlay">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="font-mono text-xs gap-1" asChild>
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

        <Card className="bg-ide-sidebar border-border">
          <CardContent className="p-4 flex items-center gap-3">
            {avatarUrl && (
              <img src={avatarUrl} alt={githubLogin ?? ''} className="w-9 h-9 rounded-full border border-border" />
            )}
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">@{githubLogin}</p>
              {existingBender && (
                <p className="font-mono text-xs text-muted-foreground">
                  {existingBender.handle} · {existingBender.discipline}
                </p>
              )}
              {!existingBender && <p className="font-mono text-xs text-muted-foreground">{user?.email}</p>}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <p className="font-mono text-sm text-syntax-comment animate-pulse text-center py-16">
            // loading workspace...
          </p>
        ) : (
          existingBender && <ProfileWorkspaceEditor benderId={existingBender.id} />
        )}
      </div>
    </div>
  );
}
