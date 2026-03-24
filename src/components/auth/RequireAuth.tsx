import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="font-mono text-sm text-syntax-comment animate-pulse">
          // authenticating...
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
