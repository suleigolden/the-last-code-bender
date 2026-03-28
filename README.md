# The Last Code Bender

> An open-source developer legacy project.  
> Clone. Contribute. Claim your rank.

**Live site:** [thelastcodebender.com](https://thelastcodebender.com/)  
**In-app documentation:** [thelastcodebender.com/docs](https://thelastcodebender.com/docs) (same structure as this README: About, Contributing, Skill, Rules)

---

## About

**The Last Code Bender** is a developer legacy project: **1,400 unique ranks** — one developer per rank, forever. You claim a rank from the **Dashboard**, then build your public profile in the **Profile workspace**. Once claimed, a rank is yours permanently.

- **Ranks per discipline:** 200  
- **Disciplines (7):**
  - **Frontend Bender** — UI, React, CSS
  - **Backend Bender** — APIs, databases, servers
  - **FullStack Bender** — end-to-end
  - **Security Bender** — AppSec, defense
  - **AI Bender** — ML, LLMs, data science
  - **DevOps Bender** — infra, CI/CD, cloud
  - **QA Bender** — testing, quality, reliability

**Rank tiers** (per discipline): Apprentice (ranks 1–50), Journeyman (51–100), Senior (101–150), Master (151–200). Rank 1 is the most prestigious — first to claim wins it.

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

A **Claude Code Skill** is a custom prompt or workflow you publish that others can install into their Claude Code CLI. When your skill is live, **`skill_live`** is true on your profile (e.g. **Skill Live** in the Hall of Fame).

| Field | Meaning |
|--------|---------|
| `skill_live` | `true` after the skill passes AI review and is published |
| `skill_version` | Semantic version (e.g. `1.0.0`), or `null` if not published |
| `demo_url` | Live demo URL; set from Dashboard Showcase; can embed on your profile |

**XP examples**

| Action | XP |
|--------|-----|
| Workspace save (with commit message) | +10 |
| Skill approved (`SKILL.md` AI review) | +50 |
| Challenge submit | +10 |
| Challenge win | +100 |
| Showcase published (first demo URL) | +20 |

**Publishing a skill:** Build the skill → add content in `SKILL.md` → Submit for AI Review → iterate until approved.

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
