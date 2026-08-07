-- Run this file once in Supabase Dashboard > SQL Editor.
-- It deliberately contains no password, secret key, or administrator identity.

create extension if not exists pgcrypto;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'general' check (char_length(type) <= 80),
  station text not null default '' check (char_length(station) <= 120),
  body text not null check (char_length(body) between 4 and 5000),
  contact text not null default '' check (char_length(contact) <= 160),
  page text not null default '' check (char_length(page) <= 500),
  user_agent text not null default '' check (char_length(user_agent) <= 800),
  status text not null default 'new' check (status in ('new', 'doing', 'done')),
  note text not null default '' check (char_length(note) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated;

create policy "Anyone can submit a report"
on public.reports for insert
to anon, authenticated
with check (
  char_length(body) between 4 and 5000
  and char_length(type) <= 80
  and char_length(station) <= 120
  and char_length(contact) <= 160
  and char_length(page) <= 500
  and char_length(user_agent) <= 800
);

create policy "Administrators can read reports"
on public.reports for select
to authenticated
using ((select public.is_admin()));

create policy "Administrators can update reports"
on public.reports for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Administrators can delete reports"
on public.reports for delete
to authenticated
using ((select public.is_admin()));

-- After you create your first Auth user, run this in the SQL Editor once:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
