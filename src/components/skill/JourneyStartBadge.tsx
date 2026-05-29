import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JourneyStartBadgeProps {
  journeyStartedAt: string | null
  githubUsername: string
  className?: string
}

export function JourneyStartBadge({
  journeyStartedAt,
  githubUsername,
  className,
}: JourneyStartBadgeProps) {
  const formatted = journeyStartedAt
    ? new Date(journeyStartedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div
      className={cn(
        'inline-flex items-start gap-2 px-3 py-2',
        'bg-ide-sidebar border border-border rounded-md',
        'font-mono text-xs',
        className,
      )}
    >
      <Lock className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        {formatted ? (
          <>
            <span className="text-foreground">Journey started {formatted}</span>
            <br />
            <span className="text-muted-foreground">
              Locked to @{githubUsername} GitHub account creation
            </span>
          </>
        ) : (
          <span className="text-muted-foreground animate-pulse">Syncing from GitHub...</span>
        )}
      </div>
    </div>
  )
}
