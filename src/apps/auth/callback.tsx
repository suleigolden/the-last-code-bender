import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      try {
        localStorage.setItem('auth_token', token);
      } catch {
        // ignore storage errors
      }
    }
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <p className="font-mono text-sm text-syntax-comment animate-pulse">// authenticating...</p>
    </div>
  );
}
