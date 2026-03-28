import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  githubLogin: string | null;
  avatarUrl: string | null;
  isLoading: boolean;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const user = session?.user ?? null;
  const githubLogin =
    (user?.user_metadata?.user_name as string | undefined) ??
    (user?.user_metadata?.preferred_username as string | undefined) ??
    null;
  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <AuthContext.Provider
      value={{ session, user, githubLogin, avatarUrl, isLoading, signInWithGitHub, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
