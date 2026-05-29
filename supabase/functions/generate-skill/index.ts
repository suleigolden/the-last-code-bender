import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GITHUB_API = 'https://api.github.com'
const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference/chat/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { handle, github_username, discipline, force_refresh } = await req.json()

  if (!handle || !github_username) {
    return new Response(
      JSON.stringify({ error: 'handle and github_username are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Always fetch bender to get id (also used for workspace update later)
  const { data: existing } = await supabase
    .from('benders')
    .select('id, github_synced_at, github_data_cache')
    .eq('handle', handle)
    .maybeSingle()

  // ── Check if recent sync exists (skip if synced within 1 hour
  //    unless force_refresh is true) ────────────────────────────
  if (!force_refresh && existing?.github_synced_at) {
    const syncAge = Date.now() - new Date(existing.github_synced_at).getTime()
    if (syncAge < 60 * 60 * 1000) {
      return new Response(
        JSON.stringify({
          status: 'cached',
          message: 'Using recent GitHub sync. Use force_refresh to override.',
          synced_at: existing.github_synced_at,
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      )
    }
  }

  const githubToken = Deno.env.get('GITHUB_TOKEN')
  if (!githubToken) {
    return new Response(
      JSON.stringify({ error: 'Missing GITHUB_TOKEN secret' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  // ── Step 1: Fetch GitHub data ─────────────────────────────────
  const githubHeaders: HeadersInit = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${githubToken}`,
  }

  // deno-lint-ignore no-explicit-any
  let user: Record<string, any>
  // deno-lint-ignore no-explicit-any
  let repos: Record<string, any>[] = []
  // deno-lint-ignore no-explicit-any
  let events: Record<string, any>[] = []

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${github_username}`, { headers: githubHeaders }),
      fetch(`${GITHUB_API}/users/${github_username}/repos?sort=updated&per_page=100`, {
        headers: githubHeaders,
      }),
      fetch(`${GITHUB_API}/users/${github_username}/events?per_page=100`, {
        headers: githubHeaders,
      }),
    ])

    if (!userRes.ok) {
      return new Response(
        JSON.stringify({ error: `GitHub user not found: ${github_username}` }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      )
    }

    user = await userRes.json()
    if (reposRes.ok) repos = await reposRes.json()
    if (eventsRes.ok) events = await eventsRes.json()
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `GitHub API error: ${(err as Error).message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  // ── Step 2: Analyse GitHub data ───────────────────────────────
  const ownRepos = repos.filter((r) => !r.fork)

  const languageFrequency: Record<string, number> = {}
  for (const repo of ownRepos) {
    if (repo.language) {
      languageFrequency[repo.language] = (languageFrequency[repo.language] ?? 0) + 1
    }
  }

  const topByStars = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)

  const activeRepos = [...repos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 10)

  const allTopics = [...new Set(repos.flatMap((r) => r.topics ?? []))]

  const pushCount = events.filter((e) => e.type === 'PushEvent').length
  const prReviewCount = events.filter((e) => e.type === 'PullRequestReviewEvent').length
  const issueCount = events.filter(
    (e) => e.type === 'IssuesEvent' || e.type === 'IssueCommentEvent',
  ).length
  const forkCount = events.filter((e) => e.type === 'ForkEvent').length
  const total = pushCount + prReviewCount + issueCount + forkCount || 1

  const dominantPattern =
    pushCount / total > 0.6
      ? 'builder'
      : prReviewCount / total > 0.3
        ? 'reviewer'
        : issueCount / total > 0.3
          ? 'community'
          : 'mixed'

  const joinDate = new Date(user.created_at as string)
  const yearsOnGitHub = Math.max(
    0,
    Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)),
  )

  const mapRepo = (r: Record<string, unknown>) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    pushed_at: r.pushed_at,
    topics: (r.topics as string[]) ?? [],
    html_url: r.html_url,
    is_fork: r.fork,
  })

  const githubDataCache = {
    account_created_at: user.created_at,
    years_on_github: yearsOnGitHub,
    public_repos_count: user.public_repos,
    followers: user.followers,
    bio: user.bio ?? null,
    top_languages: languageFrequency,
    top_repos_by_stars: topByStars.map(mapRepo),
    active_repos: activeRepos.map(mapRepo),
    all_topics: allTopics,
    contribution_pattern: {
      push_count: pushCount,
      pr_review_count: prReviewCount,
      issue_count: issueCount,
      fork_count: forkCount,
      dominant_pattern: dominantPattern,
    },
    fetched_at: new Date().toISOString(),
  }

  // ── Step 3: Build SKILL.md generation prompt ──────────────────
  const sortedLanguages = Object.entries(languageFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([lang, count]) => `  ${lang}: ${count} repos`)
    .join('\n')

  const topRepoSummary = topByStars
    .map(
      (r) =>
        `  - ${r.name}${r.description ? ': ' + r.description : ''} ` +
        `(${r.language ?? 'no language'}, ⭐${r.stargazers_count})`,
    )
    .join('\n')

  const activeRepoSummary = activeRepos
    .map((r) => `  - ${r.name} (last pushed: ${String(r.pushed_at).split('T')[0]})`)
    .join('\n')

  const patternDescription = {
    builder: 'Primarily a builder — high commit frequency, ships regularly',
    reviewer: 'Strong reviewer — contributes through PR reviews and code quality',
    community: 'Community contributor — active in issues and discussions',
    mixed: 'Balanced contributor across building, reviewing, and community',
  }[dominantPattern]

  const journeyFormatted = joinDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const generationPrompt = `You are generating a SKILL.md for TheLastCodeBender platform.
This becomes a Claude Code skill — when a developer invokes @${handle},
Claude will adopt this developer's coding style and approach.

IMPORTANT RULES:
- Base EVERY claim on the actual GitHub data provided below
- Do not invent languages, frameworks, or experience not evidenced in the data
- The ## Journey started section MUST use exactly: "${journeyFormatted}"
  and the note "This date is locked — it reflects when this developer's
  first public GitHub account was created."
- Be specific and personal — reference actual repo names where relevant
- Infer philosophy from contribution patterns, not generic platitudes

DEVELOPER GITHUB DATA:
Handle: ${handle}
Discipline: ${discipline}
GitHub username: ${github_username}
Account created: ${user.created_at} (${yearsOnGitHub} years ago)
Public repos: ${user.public_repos}
Followers: ${user.followers}
Bio: ${user.bio ?? 'Not set'}

Primary languages (by repo count, own repos only):
${sortedLanguages || '  No clear primary language detected'}

Top repos by stars:
${topRepoSummary || '  No starred repos found'}

Most recently active repos:
${activeRepoSummary || '  No recent activity found'}

Repository topics: ${allTopics.length > 0 ? allTopics.join(', ') : 'None declared'}

Contribution pattern (last 90 days of public events):
  Push events: ${pushCount}
  PR review events: ${prReviewCount}
  Issue events: ${issueCount}
  Fork events: ${forkCount}
  Pattern: ${patternDescription}

Generate a complete SKILL.md with EXACTLY these sections in this order:

## Identity
One sentence: who this developer is based on their actual GitHub presence.

## Primary stack
Bulleted list of technologies with evidence from their repos.
Format: - TechName (depth: primary/familiar/aware) — evidence from GitHub data
Only include technologies actually evidenced in their repos.

## Coding philosophy
3-5 bullet points inferred from their contribution patterns and repo structure.
Each must be specific and evidence-based, not generic.

## Style patterns
3-5 concrete, specific coding preferences inferred from their actual work.

## What to avoid
2-3 things to avoid, inferred from the absence or anti-patterns in their data.

## Journey started
${journeyFormatted}
This date is locked — it reflects when this developer's first public GitHub
account was created. It cannot be changed.

## Invocation note
One sentence: what coding with this skill feels like, based on their actual patterns.`

  // ── Step 4: Call GitHub Models to generate SKILL.md ───────────
  let generatedSkill = ''

  try {
    const modelRes = await fetch(GITHUB_MODELS_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: generationPrompt }],
        max_tokens: 1200,
        temperature: 0.3,
      }),
    })

    if (!modelRes.ok) {
      const errBody = await modelRes.text()
      throw new Error(`GitHub Models error ${modelRes.status}: ${errBody}`)
    }

    const modelData = await modelRes.json()
    generatedSkill = modelData?.choices?.[0]?.message?.content?.trim() ?? ''
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Skill generation failed: ${(err as Error).message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  if (!generatedSkill) {
    return new Response(
      JSON.stringify({ error: 'Generation returned empty content' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  // ── Step 5: Write everything to Supabase ──────────────────────
  const now = new Date().toISOString()

  // Update benders row — journey_started_at is locked to GitHub account creation date.
  // Service role bypasses RLS, so the Edge Function can set it directly.
  await supabase
    .from('benders')
    .update({
      journey_started_at: user.created_at,
      github_data_cache: githubDataCache,
      github_synced_at: now,
      cached_skill: generatedSkill,
      skill_live: true,
    })
    .eq('handle', handle)

  // Update the workspace SKILL.md file so it appears in the editor.
  // bender_profile_workspace is keyed by bender_id (UUID), not handle.
  const benderId = existing?.id
  if (benderId) {
    const { data: workspace } = await supabase
      .from('bender_profile_workspace')
      .select('files')
      .eq('bender_id', benderId)
      .maybeSingle()

    if (workspace?.files) {
      const updatedFiles = { ...workspace.files, 'SKILL.md': generatedSkill }
      await supabase
        .from('bender_profile_workspace')
        .update({ files: updatedFiles })
        .eq('bender_id', benderId)
    }
  }

  return new Response(
    JSON.stringify({
      status: 'generated',
      skill_preview: generatedSkill.slice(0, 200) + '...',
      github_data: {
        journey_started: user.created_at,
        years_on_github: yearsOnGitHub,
        top_languages: Object.keys(languageFrequency).slice(0, 5),
        repos_analysed: repos.length,
      },
      message: 'SKILL.md generated. Open your workspace to review and submit for AI review.',
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } },
  )
})
