-- LoveyPortfolio: database, Auth authorization, Storage, and analytics schema.
-- Apply with `supabase db push` after linking this repository to a Supabase project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create table if not exists public.projects (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('visit', 'page_view', 'project_view')),
  project_id text references public.projects(id) on delete set null,
  page_name text,
  device_type text not null check (device_type in ('desktop', 'mobile')),
  session_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_project_id_idx on public.analytics_events(project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.analytics_events enable row level security;

create policy "Administrators can view profiles"
on public.profiles for select to authenticated
using ((select auth.uid()) = id or (select public.is_admin()));

create policy "Public can view projects"
on public.projects for select to anon, authenticated
using (true);

create policy "Administrators manage projects"
on public.projects for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Visitors can insert analytics events"
on public.analytics_events for insert to anon, authenticated
with check (
  event_type in ('visit', 'page_view', 'project_view')
  and device_type in ('desktop', 'mobile')
  and length(coalesce(page_name, '')) <= 100
);

create policy "Administrators can view analytics"
on public.analytics_events for select to authenticated
using ((select public.is_admin()));

create policy "Administrators can delete analytics"
on public.analytics_events for delete to authenticated
using ((select public.is_admin()));

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "Public can read portfolio assets"
on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio-assets');

create policy "Administrators manage portfolio assets"
on storage.objects for all to authenticated
using (bucket_id = 'portfolio-assets' and (select public.is_admin()))
with check (bucket_id = 'portfolio-assets' and (select public.is_admin()));
