# The Last Code Bender

> An open-source developer legacy project.  
> Clone. Contribute. Claim your rank.

**Live site:** [thelastcodebender.com](https://thelastcodebender.com/)  
**In-app documentation:** [thelastcodebender.com/docs](https://thelastcodebender.com/docs) (same structure as this README: About, Contributing, Skill, Rules)

---

## About

**The Last Code Bender** is a developer legacy project: **unlimited ranks** — one developer per rank, forever. You claim a rank from the **Dashboard**, then build your public profile in the **Profile workspace**. Once claimed, a rank is yours permanently.

- **Disciplines (7):**
  - **Frontend Bender** — UI, React, CSS
  - **Backend Bender** — APIs, databases, servers
  - **FullStack Bender** — end-to-end
  - **Security Bender** — AppSec, defense
  - **AI Bender** — ML, LLMs, data science
  - **DevOps Bender** — infra, CI/CD, cloud
  - **QA Bender** — testing, quality, reliability

**Rank tiers** (per discipline): Apprentice (ranks 1–50), Journeyman (51–100), Senior (101–150), Master (151+). Rank 1 is the most prestigious — first to claim wins it.

Every registered developer (CodeBender) profile is a **Claude Code Skill** generated directly from their GitHub profile. Anyone in the world can install it and invoke it in their Claude Code CLI — and Claude will write code exactly as that developer does: their stack, their architecture patterns, their conventions, all derived from their real GitHub work.

XP grows through workspace activity, skill reviews, challenges, and showcase publishing.

**Site stack:** React 18 + TypeScript 5 + Vite 5, Tailwind CSS 3 + shadcn/ui, React Router DOM 6, TanStack React Query 5, Vitest + Testing Library.

---

## Contributing

Primary workflow: **Dashboard → Profile workspace → Save → Publish.**

1. **Sign in with GitHub** — `/login` → Continue with GitHub (you land on the Dashboard).
2. **Register your rank** — Pick a discipline, enter your handle prefix (the discipline suffix is appended). Example: prefix `MyHandle` → full handle `MyHandleFrontendBender`. Use **Hall of Fame** to confirm the rank is free.
3. **Open the Profile workspace** — Dashboard → “Start editing profile” → `/dashboard/workspace`.
4. **Edit your sources** (what visitors see):
   - `index.tsx` — profile entry
   - `sections/*.tsx` — optional sections
   - `styles.css`
   - `SKILL.md` — skill text (submit for AI review)
   - `stack/stack.json` — tech stack (recruiter matching)
5. **Save with a commit message** — Creates snapshots and can award XP (timeline on the Dashboard). Example: `feat: add hero + socials`.
6. **Publish your skill (optional)** — Profile workspace → `SKILL.md` → “Submit for AI Review”.
7. **Showcase (optional)** — Dashboard → Showcase → add demo URL, type, and description.

**Platform / codebase changes:** Open a PR; CI runs tests and build on pushes and pull requests.

---

## Skills & XP

A **Claude Code Skill** is a personalized AI coding assistant generated from your public GitHub profile. TheLastCodeBender analyzes your repositories, programming languages, contribution patterns, and completed projects to produce a `SKILL.md` — a structured prompt that captures precisely how you write code.

Once your skill is published, any developer in the world can install it into their Claude Code CLI and invoke it by your handle. Claude will then behave as you would: applying your preferred stack, following your architectural patterns, and reflecting the coding style and decisions evident across your GitHub history. Your skill is a living representation of your engineering identity.

When your skill is live, **`skill_live`** is true on your profile (e.g. **Skill Live** in the Hall of Fame).

| Field | Meaning |
|--------|---------|
| `skill_live` | `true` after the skill passes AI review and is published |
| `skill_version` | Semantic version (e.g. `1.0.0`), or `null` if not published |
| `demo_url` | Live demo URL; set from Dashboard Showcase; can embed on your profile |

**XP examples**

| Action | XP |
|--------|-----|
| Workspace save (with commit message) | +10,000 |
| Skill approved (`SKILL.md` AI review) | +5,000 |
| Challenge submit | +10 |
| Challenge win | +10,000 |
| Showcase published (first demo URL) | +20 |

**Publishing a skill:** Build the skill → add content in `SKILL.md` → Submit for AI Review → iterate until approved.

### Generating a skill from GitHub

1. Open your **Profile workspace** → `SKILL.md` tab.
2. Click **Generate from GitHub** — this calls the `generate-skill` Edge Function, which fetches your public GitHub data (repositories, languages, contribution patterns, and project history) and generates a personalized `SKILL.md` that reflects your real engineering work.
3. Review and refine the generated content in the editor.
4. Click **Submit for AI Review** — the skill is evaluated and, once approved, `skill_live` is set to `true` on your profile.
5. Your skill is now live and installable by any developer in the world.

### Installing a CodeBender skill in your own project

Any live skill can be installed into your Claude Code CLI in two steps.

**Step 1 — Install the skill** (run in your terminal):

```bash
curl -fsSL "https://the-last-code-bender-api.onrender.com/api/skills/TheLastCodeBender" \
  --create-dirs -o ~/.claude/skills/TheLastCodeBender/SKILL.md
```

Replace `TheLastCodeBender` with any handle that has a live skill. The curl command is also available on every CodeBender's profile page under **// install this skill**.

**Step 2 — Invoke the skill** in a Claude Code session:

```
/TheLastCodeBender
```

Claude will load that developer's `SKILL.md` and write code in their style for the session — applying their stack, architecture patterns, conventions, and preferences as reflected in their GitHub profile and completed projects.

> **Note:** `VITE_SUPABASE_URL` is the Project URL from your `.env` file or Supabase Dashboard → Project Settings → API → Project URL.

---

## Rules

- **Primary workflow is in the app:** Dashboard → Profile workspace → save with a commit message. Pull requests are for improving the platform itself.
- **One developer, one rank, one profile.** Do not claim multiple ranks or submit multiple profiles.
- **Do not edit another contributor’s profile** or impersonate someone else.
- **Profile code:** Use Tailwind **IDE design tokens** (e.g. `bg-ide-sidebar`, `text-syntax-keyword`, `border-border`) — avoid hardcoded hex/rgb and inline `style` colors.
- **Do not add new npm dependencies** or change `package.json` for profile work; use what the project already includes.
- **No offensive, harmful, or illegal content.** No committing `dist/`, `node_modules/`, or other build artifacts.

**Encouraged:** Save meaningful updates often, use `SKILL.md` and `stack/stack.json` as intended, preview your public profile and showcase demo like a visitor would.

---

## FAQ

**Can I update my profile later?**  
Yes — use the Dashboard and Profile workspace.

**Can I claim multiple ranks?**  
No. One developer, one rank.

**Can beginners join?**  
Yes. Your journey matters at every level.

---

## Environment setup

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`. See `supabase/README.md` for the full guide.

---

## Running the project locally

**Prerequisites:** Node.js 18+ and npm, Yarn, or Bun.

```bash
git clone https://github.com/YOUR_USERNAME/the-last-code-bender.git
cd the-last-code-bender
```

Install dependencies (pick one):

```bash
npm install
# or: yarn install
# or: bun install
```

Start the dev server:

```bash
npm run dev
# or: yarn dev
# or: bun dev
```

The app defaults to **http://localhost:3004** (or whatever `PORT` you set — see `vite.config.ts`).

**Useful scripts:** `npm run build`, `npm run preview`, `npm test`, `npm run lint`.

---

Clone. Contribute. Claim your rank.

For the full walkthrough with the same sections as the site, open **[Docs](https://thelastcodebender.com/docs)** (`/docs` when running locally).
