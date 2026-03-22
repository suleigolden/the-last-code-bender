import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TheLastCodeBenderProfile from '../TheLastCodeBender';

describe('TheLastCodeBenderProfile', () => {
  it('renders without crash', () => {
    render(<TheLastCodeBenderProfile />);
  });

  it('shows TheLastCodeBender in the README tab', () => {
    render(<TheLastCodeBenderProfile />);
    const matches = screen.getAllByText(/TheLastCodeBender/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows main branch indicator in status bar', () => {
    render(<TheLastCodeBenderProfile />);
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('shows founder amber banner text', () => {
    render(<TheLastCodeBenderProfile />);
    expect(
      screen.getByText(/This is the reference profile/),
    ).toBeInTheDocument();
  });

  it('shows SKILL.md live in status strip', () => {
    render(<TheLastCodeBenderProfile />);
    expect(screen.getByText(/SKILL\.md live/)).toBeInTheDocument();
  });
});
