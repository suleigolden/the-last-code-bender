import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 mr-2 shrink-0"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function LoginPage() {
  const { session, signInWithGitHub } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    setIsRedirecting(true);
    await signInWithGitHub();
    // Note: page will redirect — no need to reset state
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 noise-overlay">
      <div className="fixed inset-0 ide-grid-bg pointer-events-none opacity-20" />

      <div className="relative z-10 w-full max-w-sm">
        <Card className="bg-ide-sidebar border-border">
          <CardHeader className="text-center space-y-2 pb-2">
            <p className="font-mono text-xs text-syntax-comment">// claim your rank</p>
            <h1 className="font-mono text-2xl font-bold text-foreground">
              The<span className="text-cyan-400">Last</span>CodeBender
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Sign in with GitHub to claim your permanent rank
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <Button
              className="w-full font-mono glow-primary"
              size="lg"
              onClick={handleLogin}
              disabled={isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <span className="w-4 h-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <GitHubIcon />
                  Continue with GitHub
                </>
              )}
            </Button>

            <p className="text-center font-mono text-xs text-muted-foreground">
              We only read your public GitHub profile.
              <br />
              No private data is accessed.
            </p>

            <div className="pt-2 text-center">
              <Link
                to="/"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
