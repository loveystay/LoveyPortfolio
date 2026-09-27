# LoveyPortfolio

Portfolio frontend built with React, Vite, and TypeScript. It deploys as a static site to Vercel and uses Supabase for PostgreSQL, Auth, Storage, analytics, and Edge Functions.

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` before using authentication, project CRUD, file uploads, analytics, or AI features.

For local AI consultation without Supabase, set `GEMINI_API_KEY` in the root `.env` and run `npm run dev`. The Vite development server exposes a server-only `/api/chat` endpoint; the key is never bundled into browser code.

## Supabase

Database migrations, Edge Functions, RLS policies, and Storage setup live in [`supabase/`](supabase). Follow [`supabase/README.md`](supabase/README.md) to link a project, create the administrator profile, set the Gemini secret, and deploy the functions.

## Deploy to Vercel

Import the repository into Vercel. Set the two `VITE_SUPABASE_*` environment variables for Production, Preview, and Development, then deploy. The Vercel build command is `npm run build` and the output directory is `dist`.

Also set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in Vercel Environment Variables to use the `/api/chat` serverless fallback. Never prefix the Gemini key with `VITE_`.

## Validation

```bash
npm run lint
npm run build
```
