import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { decodeJwtPayload } from '@/lib/api-client';

export interface AuthUser {
  id: string;
  github_login: string;
  avatar_url: string | null;
  email: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  githubLogin: string | null;
  avatarUrl: string | null;
  isLoading: boolean;
  signInWithGitHub: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

function readUserFromStorage(): AuthUser | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    // Check expiry
    if (payload.exp && typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return {
      id: payload.sub as string,
      github_login: payload.github_login as string,
      avatar_url: (payload.avatar_url as string | null) ?? null,
      email: (payload.email as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(readUserFromStorage());
    setIsLoading(false);

    // Listen for storage changes (other tabs signing in/out)
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) {
        setUser(readUserFromStorage());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signInWithGitHub = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  const signOut = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
    setUser(null);
  };

  const githubLogin = user?.github_login ?? null;
  const avatarUrl = user?.avatar_url ?? null;

  return (
    <AuthContext.Provider value={{ user, githubLogin, avatarUrl, isLoading, signInWithGitHub, signOut }}>
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
