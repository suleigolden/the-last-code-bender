import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JourneyStartBadge } from '@/components/skill/JourneyStartBadge'

describe('JourneyStartBadge', () => {
  it('renders the formatted date', () => {
    render(
      <JourneyStartBadge
        journeyStartedAt="2020-03-14T10:00:00Z"
        githubUsername="testuser"
      />,
    )
    expect(screen.getByText(/Journey started/)).toBeInTheDocument()
    expect(screen.getByText(/March 14, 2020/)).toBeInTheDocument()
  })

  it('shows GitHub username in the locked message', () => {
    render(
      <JourneyStartBadge
        journeyStartedAt="2020-03-14T10:00:00Z"
        githubUsername="testuser"
      />,
    )
    expect(screen.getByText(/@testuser/)).toBeInTheDocument()
  })

  it('shows syncing state when journeyStartedAt is null', () => {
    render(
      <JourneyStartBadge
        journeyStartedAt={null}
        githubUsername="testuser"
      />,
    )
    expect(screen.getByText(/Syncing from GitHub/)).toBeInTheDocument()
  })

  it('renders a lock icon', () => {
    const { container } = render(
      <JourneyStartBadge
        journeyStartedAt="2020-01-01T00:00:00Z"
        githubUsername="testuser"
      />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
