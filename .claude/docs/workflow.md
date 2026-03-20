# Claude workflow: tests and commits

These rules apply whenever Claude (or any agent) finishes a **feature** or **behavior change** in this repo.

Treat them as mandatory unless the change falls into one of these **exempt categories** — if so, note the exception in the commit body:

| Exempt category | Example |
|---|---|
| Docs-only | Updating `README.md`, `PLANNING.md`, adding comments |
| Config-only with no runtime impact | Tweaking `.lintstagedrc.json`, `tsconfig` paths |
| Purely cosmetic assets | Adding a PNG to `public/`, renaming a font file |
| CodeBenders profile content | Adding/editing story, stack, socials, demo files under `CodeBenders/` |

---

## 1. Identify what changed — then test the right layer

This repo has **two distinct layers**, each with different test tooling:

### Layer A — React frontend (`src/`)

Changes to TypeScript/TSX files in `src/` require **Vitest + Testing Library** tests.

**Add or extend tests** in one of:
- Colocated: `src/components/foo/Foo.test.tsx` next to the component
- Grouped: `src/lib/__tests__/bar.test.ts` for pure logic in `src/lib/`
- Integration path: `src/pages/__tests__/` for page-level flows

**What to test:**
- **React components / pages**: assert what the user sees or what event handlers do — not implementation details. Test with `render()`, query by role/label/text, fire events.
- **Pure logic** (`src/lib/fit-score.ts`, `src/lib/compatibility.ts`, `src/lib/ordinal.ts`, etc.): unit tests with explicit inputs and expected outputs.
- **TanStack Query hooks**: mock `fetch` and assert the derived data shape returned by the hook.
- **Routing flows**: at least one test that exercises the critical path when a route or redirect changes.

**Run frontend tests:**
```bash
bun test
```

Fix all failures before treating the feature as complete.

---

### Layer B — GitHub Actions scripts (`.github/scripts/`)

Changes to `.github/scripts/*.js` (the Node CJS scripts that run in CI —
`compute-xp.js`, `ai-review.js`, `generate-skill.js`, `generate-radar.js`,
`rebuild-registry.js`, etc.) require **separate Node tests**.

These scripts run outside Vitest and are not caught by `bun test`.

**Add or extend tests** in `.github/tests/`:
- `test-compute-xp.js` — for XP and rank logic
- `test-ai-review.sh` — for the AI reviewer fixtures
- `test-pr-classifier.sh` — for PR path classification logic

**Run script tests:**
```bash
node .github/tests/test-compute-xp.js
bash .github/tests/test-ai-review.sh
bash .github/tests/test-pr-classifier.sh
```

If a new script is added to `.github/scripts/`, a corresponding test
file in `.github/tests/` is required.

---

### Layer C — GitHub Actions workflows (`.github/workflows/`)

Changes to `.yml` workflow files do not have unit tests, but:

1. Validate YAML syntax before committing:
   ```bash
   npx js-yaml .github/workflows/changed-file.yml
   ```
2. Note in the commit body what the workflow does and any secrets it requires
   (e.g. `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`).
3. If the workflow touches `registry/registry.json` or `registry/leaderboard.json`,
   verify the JSON schema is unchanged or document the migration.

---

## 2. Run lint on touched files

**Before proposing a commit**, run:
```bash
bun lint
```

Fix any new ESLint issues in files you touched. Husky enforces this on staged
`.ts` / `.tsx` files anyway — catching issues early avoids a blocked commit.

> Lint is **not required** for changes to `.github/scripts/` (Node CJS, not
> covered by your ESLint config) or `CodeBenders/` profile content.

---

## 3. Full pre-commit checklist

Run in this order depending on what you changed:

```bash
# If src/ changed:
bun test
bun lint

# If .github/scripts/ changed:
node .github/tests/test-compute-xp.js      # if compute-xp.js changed
bash .github/tests/test-ai-review.sh       # if ai-review.js changed
bash .github/tests/test-pr-classifier.sh   # if pr-router logic changed

# If .github/workflows/ changed:
npx js-yaml .github/workflows/<file>.yml
```

All checks must pass before a commit is proposed.

---

## 4. Draft a commit message

When tests pass and lint is clean, **draft a commit message** for the user.

Do **not** assume permission to run `git commit` — output the message so
the user can copy it or run `git commit -m "..."`.

If the user explicitly asked the agent to commit, still follow the rules below.

---

## 5. Commit message rules

Follow [Conventional Commits](https://www.conventionalcommits.org/) with these constraints:

| Rule | Detail |
|---|---|
| **Format** | `type(scope): short summary` — summary is **~50 characters or less**, no trailing period |
| **Types** | `feat`, `fix`, `test`, `refactor`, `docs`, `chore`, `style`, `perf`, `ci` — pick the **primary** change |
| **Scope** | Optional short area name when it helps clarity |
| **Summary** | **Imperative mood**, present tense: *Add*, *Fix*, *Update* — not *Added* / *Fixes* |
| **Body** | Blank line after summary, wrap at ~72 chars. Explain **why** if not obvious |
| **Footer** | `BREAKING CHANGE:` or `Fixes #123` only when applicable |

### Scope reference for this repo

| Scope | When to use |
|---|---|
| `profile` | Bender profile page, profile components |
| `hall` | Hall of Fame page, BenderCard, UnclaimedCard |
| `challenges` | Challenges page, challenge judge, CHALLENGE.md files |
| `radar` | Stack Radar page, radar generator script |
| `recruit` | Recruiter search page, fit-score logic |
| `compat` | Compatibility scorer page and lib |
| `registry` | registry.json, leaderboard.json, rebuild-registry script |
| `xp` | XP engine, compute-xp script, rank logic |
| `skill` | SKILL.md generator, ai-review script, skill components |
| `showcase` | Demo deploy pipeline, DemoFrame component |
| `routing` | React Router config, route changes in App.tsx |
| `nav` | Navbar, Footer, Layout components |
| `lib` | Pure logic in src/lib/ |
| `ci` | GitHub Actions workflow changes |
| `bender` | CodeBenders folder content (profile PRs) |

### Good examples

```text
feat(hall): add discipline filter tabs to Hall of Fame page

test(lib): cover compatibility scorer with zero-overlap edge case

fix(routing): normalize bender handle casing before profile lookup

ci(xp): award streak XP when 30-day activity flag is set

chore(registry): seed FirstFrontendBender and FirstBackendBender entries

feat(skill): auto-generate SKILL.md on Journeyman rank promotion
```

### Avoid

```text
updated stuff
WIP
fixed bug
feat: misc changes and cleanup
fix: things
```

---

## 6. Quick checklist

- [ ] Identified which layer(s) changed (frontend / scripts / workflows)
- [ ] Tests added or updated for the changed layer
- [ ] `bun test` passes (if `src/` changed)
- [ ] Node script tests pass (if `.github/scripts/` changed)
- [ ] YAML validated (if `.github/workflows/` changed)
- [ ] `bun lint` clean for touched files
- [ ] Commit message uses conventional format, imperative summary, correct scope
- [ ] Body explains non-obvious decisions (if any)
- [ ] Exempt category noted in commit body (if applicable)
