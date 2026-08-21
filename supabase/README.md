# Supabase setup

1. Create a Supabase project and set the two `VITE_SUPABASE_*` values in `.env.local` and Vercel's environment variables.
2. Install and authenticate the Supabase CLI, then link the project: `supabase link --project-ref <project-ref>`.
3. Apply database, RLS, and Storage configuration: `supabase db push`.
4. In Supabase Auth, create the administrator email/password user. Run this once in the SQL editor, replacing the UUID with that user's Auth UID:

   ```sql
   insert into public.profiles (id, role)
   values ('AUTH_USER_UUID', 'admin')
   on conflict (id) do update set role = excluded.role;
   ```

5. Set the Edge Function secrets: `supabase secrets set GEMINI_API_KEY=<key> GEMINI_MODEL=gemini-2.5-flash`.
6. Deploy the functions: `supabase functions deploy chat` and `supabase functions deploy ai-suggest`.
7. Sign in as the administrator and select **초기 복원** once to migrate the bundled project samples into PostgreSQL.

The browser only receives the publishable key. Gemini credentials remain in Supabase Edge Function secrets.
