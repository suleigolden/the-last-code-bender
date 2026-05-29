import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGenerateSkill, useGitHubDataCache, useIsSyncStale } from '@/hooks/useBenders'

interface GenerateSkillButtonProps {
  handle: string
  githubUsername: string
  discipline: string
  onGenerated: () => void
}

const LOADING_MESSAGES = [
  'Fetching repos...',
  'Analysing contributions...',
  'Generating skill...',
]

function formatTimeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime()
  const hours = ms / (1000 * 60 * 60)
  if (hours < 1) return 'just now'
  if (hours < 24) {
    const h = Math.floor(hours)
    return `${h} hour${h === 1 ? '' : 's'} ago`
  }
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function GenerateSkillButton({
  handle,
  githubUsername,
  discipline,
  onGenerated,
}: GenerateSkillButtonProps) {
  const generateMutation = useGenerateSkill()
  const { data: cacheData } = useGitHubDataCache(handle)
  const isStale = useIsSyncStale(handle)

  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!generateMutation.isPending) return
    const id = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 1500)
    return () => clearInterval(id)
  }, [generateMutation.isPending])

  useEffect(() => {
    if (!generateMutation.isSuccess) return
    setShowSuccess(true)
    const id = setTimeout(() => setShowSuccess(false), 5000)
    return () => clearTimeout(id)
  }, [generateMutation.isSuccess])

  const handleGenerate = (forceRefresh = false) => {
    generateMutation.mutate(
      { handle, githubUsername, discipline, forceRefresh },
      { onSuccess: () => onGenerated() },
    )
  }

  // Determine current state
  const synced_at = cacheData?.github_synced_at ?? null
  const topLangs = cacheData?.github_data_cache
    ? Object.entries(cacheData.github_data_cache.top_languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([lang]) => lang)
    : []
  const repoCount = cacheData?.github_data_cache?.public_repos_count ?? 0

  // ── LOADING ──────────────────────────────────────────────────
  if (generateMutation.isPending) {
    return (
      <div className="flex flex-col items-end gap-1 min-w-0">
        <Button disabled className="font-mono text-xs gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Analysing your GitHub...
        </Button>
        <p className="font-mono text-[10px] text-muted-foreground animate-pulse">
          {LOADING_MESSAGES[loadingMsgIdx]}
        </p>
      </div>
    )
  }

  // ── SUCCESS ──────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="flex flex-col items-end gap-1 min-w-0">
        <p className="font-mono text-xs text-green-400">
          ✓ SKILL.md generated from your GitHub profile
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          Review it in the editor above, then click Submit for Review
        </p>
      </div>
    )
  }

  // ── ERROR ────────────────────────────────────────────────────
  const errorMsg =
    generateMutation.isError && generateMutation.error
      ? (generateMutation.error as Error).message
      : null

  // ── NEVER SYNCED ─────────────────────────────────────────────
  if (!synced_at) {
    return (
      <div className="flex flex-col items-end gap-1 min-w-0">
        <Button
          onClick={() => handleGenerate(false)}
          className="font-mono text-xs"
        >
          ✨ Generate from GitHub
        </Button>
        <p className="font-mono text-[10px] text-muted-foreground">
          Analyse your GitHub profile and generate a SKILL.md draft
        </p>
        {errorMsg && (
          <p className="font-mono text-[10px] text-destructive">
            {errorMsg} —{' '}
            <button
              type="button"
              className="underline"
              onClick={() => handleGenerate(false)}
            >
              Try again
            </button>
          </p>
        )}
      </div>
    )
  }

  // ── STALE (> 24h) ────────────────────────────────────────────
  if (isStale) {
    return (
      <div className="flex flex-col items-end gap-1 min-w-0">
        <Button
          variant="outline"
          onClick={() => handleGenerate(true)}
          className={cn('font-mono text-xs border-amber-500/60 text-amber-400 hover:border-amber-400')}
        >
          ↺ Update from GitHub
        </Button>
        <p className="font-mono text-[10px] text-muted-foreground">
          Last synced {formatTimeAgo(synced_at)} — your GitHub may have changed
        </p>
        {errorMsg && (
          <p className="font-mono text-[10px] text-destructive">
            {errorMsg} —{' '}
            <button
              type="button"
              className="underline"
              onClick={() => handleGenerate(true)}
            >
              Try again
            </button>
          </p>
        )}
      </div>
    )
  }

  // ── SYNCED (< 24h) ───────────────────────────────────────────
  return (
    <div className="flex flex-col items-end gap-1 min-w-0">
      <Button
        variant="outline"
        onClick={() => handleGenerate(true)}
        className="font-mono text-xs"
      >
        ↺ Regenerate from GitHub
      </Button>
      <p className="font-mono text-[10px] text-muted-foreground">
        Last synced {formatTimeAgo(synced_at)} · {repoCount} repos analysed
      </p>
      {topLangs.length > 0 && (
        <p className="font-mono text-[10px] text-muted-foreground">
          Top languages: {topLangs.join(', ')}
        </p>
      )}
      {errorMsg && (
        <p className="font-mono text-[10px] text-destructive">
          {errorMsg} —{' '}
          <button
            type="button"
            className="underline"
            onClick={() => handleGenerate(true)}
          >
            Try again
          </button>
        </p>
      )}
    </div>
  )
}

export default GenerateSkillButton
