# Supabase Setup Guide

This directory contains the database schema and setup instructions for TheLastCodeBender.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose an organisation, name your project, and set a database password
4. Wait for the project to finish provisioning (~2 min)

---

## 2. Run the Schema

1. In your Supabase dashboard, navigate to **SQL Editor**
2. Create a **New query**
3. Paste the contents of `schema.sql` into the editor
4. Click **Run**

This creates:
- `users` table (mirrors `auth.users` with GitHub profile data)
- `benders` table (the live rank registry)
- RLS policies (public read, authenticated write for own rows)
- A trigger that auto-upserts user profiles on every sign-in
- Indexes for fast lookups
- The founder seed row

---

## 3. Configure GitHub OAuth

1. In your Supabase dashboard, go to **Authentication → Providers**
2. Find **GitHub** and enable it
3. You will need a GitHub OAuth App:
   - Go to GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**
   - **Application name**: TheLastCodeBender (or similar)
   - **Homepage URL**: `https://thelastcodebender.com` (or `http://localhost:3004` for local dev)
   - **Authorization callback URL**: `https://<your-project-id>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret** from GitHub
5. Paste them into Supabase under Authentication → Providers → GitHub

---

## 4. Set Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Where to find it |
|----------|-----------------|
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase dashboard → Project Settings → API → `anon` `public` key |

> **Never commit `.env`** — it is already in `.gitignore`.

---

## 5. Configure Redirect URLs

In your Supabase dashboard, go to **Authentication → URL Configuration**:

- **Site URL**: `https://thelastcodebender.com`
- **Redirect URLs** (add all that apply):
  - `https://thelastcodebender.com/dashboard`
  - `http://localhost:3004/dashboard`

---

## 6. Verify

Start the dev server:

```bash
bun dev
# or: npm run dev
```

Then:
1. Visit `/login` — GitHub button should appear
2. Click **Continue with GitHub** — redirected to GitHub OAuth
3. After authorising, land on `/dashboard` — registration form visible
4. Visit `/hall-of-fame` — benders load live from Supabase
