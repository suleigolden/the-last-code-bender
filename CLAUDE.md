# The Last Code Bender

## Purpose
An open-source developer legacy project where 1,200 unique ranks (6 specializations × 200 each) are claimed via PR — one developer per rank, forever. The site is a VS Code-themed showcase of contributors.

Live site: https://thelastcodebender.com/

## Tech Stack
- **Framework**: React 18 + TypeScript 5 + Vite 5
- **Styling**: Tailwind CSS 3 + shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM 6
- **Data fetching**: TanStack React Query 5 (configured, minimal active use)
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library
- **Package manager**: Bun (also supports Yarn/npm)

## Key Directories

| Path | Purpose |
|------|---------|
| `src/apps/` | Page-level components (landing page, codebender profiles, 404) |
| `src/apps/landing-page/sections/` | Hero, Story, Stack, Portrait, Socials sections |
| `src/apps/codebender-profile/` | Individual developer profile page + placeholder |
| `src/components/ide/` | IDE chrome: `IDESidebar`, `IDETabBar`, `IDEStatusBar`, `LineNumbers` |
| `src/components/ui/` | shadcn/ui primitives (buttons, cards, dialogs, etc.) |
| `src/lib/` | Core utilities: rank generation, ordinals, file name constants, `cn()` |
| `src/hooks/` | `use-mobile.tsx`, `use-toast.ts` |
| `src/test/` | Vitest setup and example tests |
| `public/` | Static assets (favicon, images) |

Key files:
- `src/lib/code-bender-names.ts` — generates the 1,200 rank lookup map
- `src/lib/ordinals.ts` — ordinal word generator used by rank names
- `src/lib/helper.ts` — section-name → filename constants
- `src/App.tsx` — route definitions and providers

## Commands

```bash
bun dev          # Dev server on port 3004 (or $PORT)
bun build        # Production build
bun preview      # Preview production build
bun test         # Run tests once
bun test:watch   # Tests in watch mode
bun lint         # ESLint check
bun lint:fix     # ESLint auto-fix
```

Pre-commit: Husky runs `eslint --fix` + `eslint --max-warnings=0` on staged `.ts/.tsx` files.

## Path Aliases
`@/*` resolves to `src/*` (configured in `tsconfig.app.json` and `vite.config.ts`).

## Adding a Contributor
A new contributor creates a profile under the appropriate specialization folder. The app routes `/codebender/:codebenderId` and `/codebender/:codebenderId/:section` to `CodeBenderProfile` which renders their content or falls back to `CodeBenderPlaceholder`.

---

## Additional Documentation

| File | When to check |
|------|---------------|
| `.claude/docs/architectural_patterns.md` | IDE layout pattern, routing conventions, component hierarchy, state management, rank data flow |
| `.claude/docs/claude_workflow.md` | After features: add/run tests (`bun test`), then draft commit messages (Conventional Commits) |
