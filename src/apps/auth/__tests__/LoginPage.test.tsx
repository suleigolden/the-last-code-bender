import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../index';

// ── Mock AuthContext ───────────────────────────────────────────────────────────
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    session: null,
    user: null,
    githubLogin: null,
    avatarUrl: null,
    isLoading: false,
    signInWithGitHub: vi.fn(),
    signOut: vi.fn(),
  }),
}));

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('LoginPage', () => {
  it('renders the heading and GitHub button when unauthenticated', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/claim your rank/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /continue with github/i }),
    ).toBeInTheDocument();
  });

  it('renders a back-to-home link', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
  });
});
