import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BenderProfilePage } from '@/pages/BenderProfilePage';

function renderWithRouter(initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/benders/:discipline/:handle" element={<BenderProfilePage />} />
          <Route path="/hall-of-fame" element={<div>Hall of Fame</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('BenderProfilePage guard', () => {
  it('redirects codebender-profile-placeholder to /hall-of-fame', () => {
    renderWithRouter('/benders/founder/codebender-profile-placeholder');
    expect(screen.getByText('Hall of Fame')).toBeInTheDocument();
  });
});
