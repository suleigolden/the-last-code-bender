import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useHasClaimedRank } from '@/hooks/useBenders';
import { DashboardContentSection } from './DashboardContentSection';

export function Dashboard() {
  const { user, githubLogin, avatarUrl, signOut } = useAuth();

  const { data: existingBender, isLoading: checkingClaim } = useHasClaimedRank(githubLogin);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background noise-overlay overflow-x-hidden">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-20" />

      <div className="relative z-10 flex w-full min-w-0 flex-1 flex-col px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-xl sm:max-w-2xl lg:max-w-3xl min-w-0 space-y-5 sm:space-y-6">
          {/* Header */}
          <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between gap-y-2 min-w-0">
            <div className="min-w-0">
              <p className="font-mono text-xs text-syntax-comment">// dashboard</p>
              <h1 className="font-mono text-xl sm:text-2xl font-bold text-foreground mt-1 break-words">
                The<span className="text-cyan-400">Last</span>CodeBender
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs shrink-0 self-start sm:self-auto"
              onClick={signOut}
            >
              Sign out
            </Button>
          </header>

          {/* Identity */}
          <Card className="bg-ide-sidebar border-border overflow-hidden">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 min-w-0">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={githubLogin ?? ''}
                  className="w-9 h-9 rounded-full border border-border shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-foreground truncate">
                  @{githubLogin}
                </p>
                <p className="font-mono text-xs text-muted-foreground truncate break-all">
                  {user?.email}
                </p>
              </div>
            </CardContent>
          </Card>

          <DashboardContentSection
            checkingClaim={checkingClaim}
            existingBender={existingBender}
            githubLogin={githubLogin}
            avatarUrl={avatarUrl}
          />
        </div>
      </div>
    </div>
  );
}
