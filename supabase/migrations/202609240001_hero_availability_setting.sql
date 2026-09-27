create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
on public.site_settings for select to anon, authenticated
using (true);

drop policy if exists "Administrators can insert site settings" on public.site_settings;
create policy "Administrators can insert site settings"
on public.site_settings for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists "Administrators can update site settings" on public.site_settings;
create policy "Administrators can update site settings"
on public.site_settings for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

insert into public.site_settings (key, value)
values ('hero_open_for_projects', 'true'::jsonb)
on conflict (key) do nothing;
