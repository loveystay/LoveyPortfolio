# LoveyPortfolio

Portfolio frontend built with React, Vite, and TypeScript. It deploys as a static site to Vercel and uses Supabase for PostgreSQL, Auth, Storage, analytics, and Edge Functions.

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` before using authentication, project CRUD, file uploads, analytics, or AI features.

## Supabase

Database migrations, Edge Functions, RLS policies, and Storage setup live in [`supabase/`](supabase). Follow [`supabase/README.md`](supabase/README.md) to link a project, create the administrator profile, set the Gemini secret, and deploy the functions.

## Deploy to Vercel

Import the repository into Vercel. Set the two `VITE_SUPABASE_*` environment variables for Production, Preview, and Development, then deploy. The Vercel build command is `npm run build` and the output directory is `dist`.

## Validation

```bash
npm run lint
npm run build
```
