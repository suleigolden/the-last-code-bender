# Contributing a Codebender Profile

> Study `TheLastCodeBender/index.tsx` first — it is the reference implementation every contributor should understand before writing their own.

---

## Overview

Each contributor gets their own `index.tsx` under `src/codebender-profiles/<Discipline Bender>/<YourHandle>/`. The system lazy-loads your component when a visitor navigates to `/benders/<discipline>/<YourHandle>`.

---

## Steps

### 1. Fork and clone

```bash
git clone https://github.com/suleigolden/the-last-code-bender.git
cd the-last-code-bender
bun install
```

### 2. Find your discipline folder

```
src/codebender-profiles/
├── Frontend Bender/
├── Backend Bender/
├── FullStack Bender/
├── Security Bender/
├── AI Bender/
└── DevOps Bender/
```

### 3. Copy the placeholder as your template

```bash
cp -r "src/codebender-profiles/Frontend Bender/FirstFrontendBender" \
      "src/codebender-profiles/Frontend Bender/YourHandle"
```

Replace `Frontend Bender` and `YourHandle` with your actual discipline and handle.

### 4. Build your profile in `index.tsx`

Your component renders **inside** `BenderProfilePage`'s content area — not a full-screen page. The outer shell (tab bar header, page chrome) is provided by the page.

Your `index.tsx` must export a default React component:

```typescript
export default function YourHandleProfile() {
  return (
    // your profile content
  );
}
```

### 5. Export from the discipline barrel

Open `src/codebender-profiles/<Discipline Bender>/index.ts` and add:

```typescript
export { default as YourHandle } from './YourHandle';
```

### 6. Add your entry to `registry.ts`

Open `src/codebender-profiles/registry.ts` and add your entry to `BENDER_PROFILES`:

```typescript
{
  handle: 'YourHandle',
  discipline: 'frontend',       // lowercase: frontend | backend | fullstack | security | ai | devops
  rank: 'YourRankName',
  xp: 0,                        // starts at 0, grows over time
  github: 'your-github-handle',
  portfolio: 'your-site.com',   // optional
  tagline: 'your tagline',      // optional
  stack: {
    primary: [{ tech: 'React', category: 'framework' }],
    familiar: [],
    aware: [],
  },
  socials: {
    linkedin: 'https://linkedin.com/in/yourhandle',  // optional
    twitter: 'https://twitter.com/yourhandle',        // optional
  },
  isPlaceholder: false,
},
```

### 7. Submit a PR

```bash
git checkout -b feat/profile-YourHandle
git add .
git commit -m "feat(profile): add YourHandle — Discipline Bender"
git push origin feat/profile-YourHandle
```

Open a PR against `main`. First merged PR wins the rank.

---

## BenderProfile field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `handle` | `string` | ✓ | Your unique identifier (must match your folder name exactly) |
| `discipline` | `string` | ✓ | Lowercase: `frontend`, `backend`, `fullstack`, `security`, `ai`, `devops` |
| `rank` | `string` | ✓ | Your rank name from the 1,200 rank lookup |
| `xp` | `number` | ✓ | Experience points (start at 0) |
| `github` | `string` | ✓ | GitHub username without `@` |
| `portfolio` | `string` | — | Personal site URL |
| `tagline` | `string` | — | One-line description |
| `stack` | `object` | — | `primary`, `familiar`, `aware` arrays of `{ tech, category }` |
| `socials` | `object` | — | `linkedin`, `twitter`, `youtube`, `email` |
| `isFounder` | `boolean` | — | Reserved — do not set |
| `isPlaceholder` | `boolean` | — | Set to `false` for real profiles |

### Stack category values

`language` | `framework` | `db` | `devops` | `other`

---

## Code style rules

- **No hardcoded hex colors** — use IDE design tokens only
- **IDE tokens**: `bg-ide-sidebar`, `bg-ide-tab`, `bg-ide-tab-active`, `bg-ide-statusbar`, `bg-file-tree-bg`, `bg-ide-sidebar-active`
- **Syntax tokens**: `text-syntax-keyword`, `text-syntax-string`, `text-syntax-function`, `text-syntax-comment`, `text-syntax-number`, `text-syntax-variable`, `text-syntax-type`
- **Font**: `font-mono` for all profile content
- **Reuse existing components**: `StoryRenderer`, `StackBadges`, `ForkRepositoryButton` — don't re-implement them

---

## Reference implementation

Open `src/codebender-profiles/TheLastCodeBender/index.tsx`. It demonstrates:

- Internal tab system (README | STORY | STACK | SOCIALS)
- File explorer sidebar (desktop-only, `bg-file-tree-bg`)
- Tab bar with active indicator (`border-t-2 border-t-syntax-keyword`)
- Bottom status strip (`bg-ide-statusbar`)
- Founder banner pattern (adapt for your own branding)
- How to use `StoryRenderer` and `StackBadges`
- How to render the README tab as syntax-highlighted pseudo-code
