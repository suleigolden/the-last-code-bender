# TheLastCodeBender — Full Vision & Architecture

> This document captures the complete product vision, architecture, and feature design for TheLastCodeBender platform, compiled from the founding planning session.

---

## Table of Contents

1. [What is TheLastCodeBender?](#what-is-thelastcodebender)
2. [Ecosystem Overview](#ecosystem-overview)
3. [Rank & Legacy System](#rank--legacy-system)
4. [CodeBenders as Claude Code Skills](#codebenders-as-claude-code-skills)
5. [Central Hub Architecture](#central-hub-architecture)
6. [Challenges Arena](#challenges-arena)
7. [Stack Intelligence & Compatibility Scoring](#stack-intelligence--compatibility-scoring)
8. [Live Project Showcase](#live-project-showcase)
9. [Recruiter & Hiring Layer](#recruiter--hiring-layer)
10. [PR Workflow & AI-Assisted Merging](#pr-workflow--ai-assisted-merging)

---

## What is TheLastCodeBender?

TheLastCodeBender is an **open-source developer legacy platform** where engineers claim a rank, share their story and tech stack, and become part of a global CodeBenders hierarchy.

The repo is the product. All data — XP, ranks, stories, stacks — lives as files in the GitHub repository. PR history is the audit log. No external database is needed.

### How claiming a rank works

For any developer to claim a rank (e.g. `FirstFrontendBender`):

1. Fork the repository
2. Clone your fork
3. Navigate to `code-benders/Frontend Bender/FirstFrontendBender/`
4. Add your content to the folders and files:
   - `story/README.md`
   - `stack/README.md`
   - `socials/README.md`
   - `assets/README.md`
5. Submit a pull request

The PR review process **is** the quality gate. Once merged, the rank is yours permanently.

---

## Ecosystem Overview

The platform has five interconnected pillars:

| Pillar | Description |
|--------|-------------|
| **AI Skills Layer** | Each Bender = a live Claude Code Skill, versioned and invokable |
| **Rank & Legacy** | Tiered progression from Apprentice → Journeyman → Senior → Master |
| **Challenges Arena** | AI-judged weekly and monthly coding competitions |
| **Live Showcase** | Deploy and demo projects directly from your repo folder |
| **Stack Intelligence** | Compatibility scoring + live Tech Radar from all STACK.md files |

---

## Rank & Legacy System

### The four tiers

| Tier | Requirement | XP Threshold |
|------|-------------|--------------|
| **Apprentice Bender** | Fork, clone, claim rank via PR | Entry |
| **Journeyman Bender** | 3 PRs merged + stack complete | 100 XP |
| **Senior Bender** | Challenge win + live demo deployed | 300 XP |
| **Master Bender** | Community vote from existing Masters | 600 XP |

### What each tier unlocks

**Apprentice**
- Public CodeBender profile
- Draft Skill YAML (v0) auto-generated from stack file

**Journeyman**
- Claude Skill goes live (v1)
- Challenges Arena access

**Senior**
- Skill versioning (v2+)
- Stack Radar contribution

**Master**
- Named legacy skill slot (never recycled)
- Mentor + PR review power

### XP sources

| Action | XP |
|--------|----|
| PR merged | +10 |
| Challenge win | +50 |
| Skill used by others | +5 |
| Peer endorsement | +15 |
| Mentoring a newcomer | +25 |
| Demo deployed | +20 |
| 30-day streak | +100 |

### TheLastCodeBender — the one seat

The single seat at the top. Not earnable through XP. Held by the founder, or re-voted by the full community if ever passed on. The GitHub handle, the repo root, the original README — that is the legacy.

---

## CodeBenders as Claude Code Skills

### What a Skill is

When a Bender reaches Journeyman rank, a GitHub Action reads their `STACK.md`, `STORY.ts`, and code examples, then synthesises a `SKILL.md` — a structured prompt document that tells Claude how to code like that person.

A `SKILL.md` captures:
- Dominant language and framework choices with reasoning
- Naming conventions (camelCase vs snake_case, file structure)
- Architecture preferences (server components, state management philosophy)
- Error handling philosophy
- Testing stance
- A short excerpt from `STORY.ts` as character context

### Build pipeline

```
Bender folder → PR merged (rank granted) → GitHub Action → SKILL.md synthesised → Published to registry (v1)
```

Updates to the folder trigger the Action again → version bumps automatically (v2, v3…)

### Invocation flow

```
Developer types @FirstFrontendBender build me a nav bar
  → Skill registry resolves @mention to latest SKILL.md
    → Claude Code loads SKILL.md as system instruction
      → Output styled in Bender's voice, stack, and patterns
```

### STACK.md structured block

```yaml
primary: TypeScript
frameworks: [Next.js, Tailwind]
databases: [Postgres, Redis]
depth: primary | familiar | aware
since: 2021
```

### Skill composition

```
@FirstFrontendBender + @FirstBackendBender
```
Merges both SKILL.md files → full-stack pair coding style for the session.

### Version pinning

```
@FirstFrontendBender@v2
```
Pins to a specific skill snapshot — reproducible, auditable coding style across a team.

---

## Central Hub Architecture

### Three-layer structure

```
Website surface (thelastcodebender.dev)
  └── Data pipeline (GitHub Actions — reads repo, writes derived data)
        └── GitHub repo (single source of truth)
              code-benders/ · challenges/ · registry/ · SKILL.md files
```

The repo-as-database philosophy: no external database needed. PR history is the audit log. The platform is permanently forkable and zero-infrastructure to run.

### Hub pages

| Page | Purpose |
|------|---------|
| **Hall of Fame** | All Benders, ranked by discipline and tier |
| **Bender profile** | Story, stack, XP history, skill version, live demo |
| **Skill registry** | Browse, search, install skills by discipline |
| **Challenges arena** | Live and past challenges, leaderboard, submissions |
| **Stack radar** | Live tech radar aggregated from all STACK.md files |
| **Activity feed** | Real-time stream of PRs, rank claims, skill updates |

### GitHub Actions backbone

On every merged PR, a suite of actions fires automatically:

- XP recomputed
- Rank thresholds checked
- `SKILL.md` re-synthesised if folder changed
- `registry.json` and `radar.json` rebuilt
- GitHub Pages site redeployed

**Cost: effectively zero.**

### Generated output files

| File | Contents |
|------|---------|
| `registry.json` | All Benders + skills |
| `leaderboard.json` | XP rankings |
| `radar.json` | Aggregated stack data |
| GitHub Pages | Static site, zero cost |

---

## Challenges Arena

### Design principle

Challenges reward **real engineering judgment**, not just algorithmic speed. LeetCode owns that space — CodeBenders owns everything else.

### Challenge types

| Type | Description | Scored on |
|------|-------------|-----------|
| **Build challenge** | Ship a working feature in 72 hrs | Quality, not just completion |
| **Refactor challenge** | Improve given broken/messy code | Readability + test coverage |
| **Debug gauntlet** | 5 bugs hidden in real code | Speed + accuracy together |
| **Architecture design** | Design a system to a spec (no code) | Diagrams + reasoning quality |
| **Skill duel** | 1v1 — same spec, different stacks | Community vote on outcome |
| **Cross-discipline relay** | Frontend + Backend Benders team up | Shared codebase handoff |

### AI judge scoring dimensions (all challenges)

- Correctness
- Code quality
- Stack alignment (calibrated against the Bender's own `SKILL.md`)
- Originality

### Challenge cadence

| Cadence | Type |
|---------|------|
| Every Monday | Weekly sprint |
| 1st of month | Monthly deep build |
| Anytime | Skill duel (open challenge) |
| Quarterly | Season Grand Prix |

### Submission lifecycle

1. Challenge opens as a GitHub Issue with spec + constraints
2. Benders submit a PR to `challenges/[name]/[handle]/`
3. GitHub Action triggers AI judge on PR — scores posted as comment
4. Leaderboard updates live — XP awarded on close

### Example weekly challenge

```
// challenges/week-42/
Spec: Build a cursor-based pagination API for a posts table.
Constraints: Must handle 1M+ rows. No OFFSET queries.
Stack: Use your declared primary language.
Bonus: Add a rate-limiter without a Redis dependency.
// Judge weights: correctness 40% · perf 30% · style 30%
```

---

## Stack Intelligence & Compatibility Scoring

### Data pipeline

```
STACK.md (free-form markdown + structured YAML)
  → Stack parser (GitHub Action extracts tech entities)
    → Normaliser (aliases resolved, categories tagged)
      → Scored record written to registry
```

### Normalisation examples

```
"Postgres" = "PostgreSQL" = "pg"
"Next"     → category: framework/react
"k8s"      = "Kubernetes" → devops/orch
"Tailwind" → category: css/utility
depth weight: primary 1.0 · familiar 0.6 · aware 0.3
```

### Depth field — the most important design decision

A Bender who lists Rust as `primary` contributes far more signal to the radar than one who lists it as `aware`. Without depth weighting, the radar gets polluted by casual mentions.

### Compatibility scoring dimensions

| Dimension | What it measures |
|-----------|-----------------|
| **Language overlap** | Shared idiom — can they meaningfully review each other's code? |
| **Tooling compatibility** | Shared CI, containers, deployment — no "works on my machine" friction |
| **Skill gap coverage** | Does pairing them produce a complete stack? |

### Tech Radar — how positions are computed

| Zone | Criteria |
|------|---------|
| **Adopt** | Used at `primary` depth by 40%+ of Senior and Master Benders |
| **Trial** | Growing 20%+ quarter-over-quarter in Journeyman+ stacks |
| **Assess** | Present in <10% of stacks but trending upward |
| **Hold** | Declining QoQ or absent from Master Bender stacks |

### Key advantage over surveys

Because `STACK.md` changes are timestamped in git history, the platform can detect when Benders drop a technology — before any blog post announces it. Temporal drift detection is a signal no survey can replicate.

### Rank-weighted signal

A Master Bender listing a technology at `primary` depth contributes **3× more weight** to the radar than an Apprentice listing it as `familiar`. Rank weighting prevents gaming and filters toward production-proven usage.

---

## Live Project Showcase

### Three deploy modes

| Mode | Description |
|------|-------------|
| **Static** | HTML/CSS/JS in `demo/` folder — zero config, served via GitHub Pages |
| **External** | `deploy.yaml` points to Vercel, Cloudflare Workers, etc. |
| **Iframe** | Embed any existing project URL |

All three render inside the Bender profile page.

### URL structure

```
thelastcodebender.dev/
  benders/frontend/
    FirstFrontendBender/
      demo/  ← live here
```

### Showcase page features

- **Multiple projects per Bender** — up to 5 projects via tab strip
- **Source link is first-class** — links to exact folder in repo, not just repo root
- **Challenge submissions** — winning challenge solutions surfaced on same page
- **Skill button** — "Use @FirstFrontendBender skill" is one click from the showcase
- **View counts feed XP** — sustained showcase traffic generates passive XP

### Automatic deploy pipeline

```
demo/ folder change → PR merged → GitHub Action detects change
  → GitHub Pages builds → Live URL auto-linked on profile
```

---

## Recruiter & Hiring Layer

### Why it makes sense

Recruiters have a terrible signal problem:
- LinkedIn → self-claimed skills only
- GitHub → activity, not quality
- CodeBender → verified, ranked, live proof

### What recruiters can see

| Signal | Source |
|--------|--------|
| **Rank as proof** | PR-gated by peers, not self-declared |
| **Challenge history** | Performance under real constraints with AI scores |
| **Live demo** | See what they actually build |
| **Try their Skill** | Load their `SKILL.md`, code with their style before interviewing |

### Fit score dimensions

- Stack match (does their stack align with the role?)
- Challenge rank (how do they perform under pressure?)
- Activity (are they actively building?)

The score is **transparent** — each dimension is visible and filterable. No black-box algorithm.

### Access tiers

| Tier | Includes |
|------|---------|
| **Free browse** | Public profiles only |
| **Recruiter seat** | Search + contact + fit score |
| **Enterprise plan** | ATS export + skill preview + team compatibility scoring |

### Bender opt-in control

Benders explicitly set in their profile file:

```yaml
open_to_work: true
visibility: all | verified-companies | private
```

Respecting this boundary is what keeps developers trusting the platform — which is what makes the recruiter data valuable in the first place.

---

## PR Workflow & AI-Assisted Merging

### The three-tier merge system

| PR type | Changed paths | Review | Outcome |
|---------|--------------|--------|---------|
| **Profile update** | Own folder only (STORY · STACK · demo/) | Automated path check | Auto-merge |
| **Skill update** | Own folder + SKILL.md | Claude AI review | AI-approved merge |
| **Structural change** | `.github/` · root · registry · other folders | Human review | Master Bender or owner |

### CODEOWNERS — the security foundation

```
# .github/CODEOWNERS

# Root + Actions — only owners can merge
*                                    @thelastcodebender
.github/                             @thelastcodebender

# Each Bender owns exactly their folder
code-benders/Frontend Bender/FirstFrontendBender/  @firstfrontendbender
code-benders/Backend Bender/FirstBackendBender/    @firstbackendbender
# ... generated automatically when a rank is claimed
```

`CODEOWNERS` does the security work. Even if the Action has a bug, GitHub's branch protection layer catches any attempt to write outside the assigned path.

### PR router workflow

```yaml
# .github/workflows/pr-router.yml
on: pull_request
jobs:
  route:
    runs-on: ubuntu-latest
    steps:
      - name: Classify changed paths
        id: classify
        run: |
          FILES=$(gh pr view $PR --json files -q '.files[].path')
          OWNER_FOLDER="code-benders/.*/$BENDER/"
          if echo "$FILES" | grep -qvE "$OWNER_FOLDER"; then
            echo "type=structural" >> $GITHUB_OUTPUT
          elif echo "$FILES" | grep -q "SKILL.md"; then
            echo "type=skill" >> $GITHUB_OUTPUT
          else
            echo "type=profile" >> $GITHUB_OUTPUT
          fi
```

### Auto-merge for profile PRs

```yaml
  auto-merge:
    needs: route
    if: ${{ needs.route.outputs.path_type == 'profile' }}
    steps:
      - name: Verify author owns folder
        # Confirm PR author matches CODEOWNERS entry
      - name: Check file size limits
        # Reject binaries >5MB, non-allowed extensions
      - name: Merge
        run: gh pr merge $PR --squash --auto
```

### AI review for SKILL.md changes

```yaml
  ai-review:
    needs: route
    if: ${{ needs.route.outputs.path_type == 'skill' }}
    steps:
      - name: AI review SKILL.md
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          SKILL=$(cat path/to/SKILL.md)
          STACK=$(cat path/to/STACK.md)
          VERDICT=$(node .github/scripts/ai-review.js "$SKILL" "$STACK")
          if [ "$VERDICT" = "approve" ]; then
            gh pr merge $PR --squash
          else
            gh pr comment $PR --body "AI review: $VERDICT"
          fi
```

### What the AI reviewer checks (SKILL.md)

1. Is the skill's declared philosophy coherent with the Bender's evidenced stack?
2. Does it contain anything harmful or misleading?
3. Are the depth claims plausible given commit history?

If all three pass → auto-merge with AI-approval comment.
If anything fails → specific concern posted as PR comment, Bender fixes and repushes.

### Cost

- Profile auto-merges: GitHub Actions compute only (near-zero)
- AI reviews: one API call per `SKILL.md` PR (cents per review)
- Structural PRs: rare, human burden stays minimal

---

## Key Architectural Principles

1. **The repo is the product.** No external database. Everything is a file.
2. **PR history is the audit log.** Every rank claim, skill update, and challenge submission is immutable git history.
3. **AI as quality partner, not gatekeeper.** AI review improves the skill registry; it doesn't block developer autonomy in their own folder.
4. **Rank is peer-validated, not self-declared.** Every Senior Bender was promoted by engineers, not by checking a box.
5. **The hub updates itself.** GitHub Actions rebuild all derived data on every merge. No manual publishing.
6. **Zero infrastructure cost.** GitHub Pages, GitHub Actions, and the Anthropic API are the entire stack.

---

*Generated from the TheLastCodeBender founding planning session.*
*For questions, open an issue or contact @thelastcodebender.*
