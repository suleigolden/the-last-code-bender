# Required GitHub Secrets

Configure these in the repository: **Settings → Secrets and variables → Actions**.

## For the React app deployment (CI build + Vercel)

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (`https://….supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon / publishable key |
| `VERCEL_TOKEN` | [Vercel account token](https://vercel.com/account/tokens) for CLI deploys |
| `VERCEL_ORG_ID` | Team / personal ID (from `.vercel/project.json` after linking, or Vercel project settings) |
| `VERCEL_PROJECT_ID` | Project ID for this app |

If you use another host (Netlify, Cloudflare Pages, etc.), replace the deploy step in `.github/workflows/deploy.yml` and document the secrets you need here instead of the Vercel trio.

## For Supabase Edge Function deployment

| Secret | Description |
|--------|-------------|
| `SUPABASE_ACCESS_TOKEN` | From [Supabase account tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_ID` | Supabase **project ref** (Project Settings → General → Reference ID) |

## For Edge Functions to call GitHub Models

Edge Functions read a Supabase secret named `GITHUB_TOKEN`. The workflow maps your GitHub Actions secret into that name.

| Secret | Description |
|--------|-------------|
| `EDGE_GITHUB_TOKEN` | GitHub PAT with permission to use GitHub Models (e.g. `models:read` as required by your org). **Not** the automatic `GITHUB_TOKEN` from Actions — that is repo-scoped and unsuitable for storing as a long-lived Models token in Supabase. |

## Auto-provided by GitHub Actions (no setup needed)

| Name | Usage |
|------|--------|
| `GITHUB_TOKEN` | Used by workflows such as `pr-router.yml` for PR API operations |
