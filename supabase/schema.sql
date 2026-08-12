-- Run this file in Supabase Dashboard > SQL Editor.
-- It is safe to run again when the reports table already exists.
-- This file contains no password, secret key, or administrator identity.

create extension if not exists pgcrypto;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  type text not null default '其他建議',
  station text not null default '',
  body text not null default '',
  contact text not null default '',
  page text not null default '',
  user_agent text not null default '',
  status text not null default 'new',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Structured fields used by the seven report categories.
alter table public.reports add column if not exists category_key text not null default 'other';
alter table public.reports add column if not exists station_code text not null default '';
alter table public.reports add column if not exists line_id text not null default '';
alter table public.reports add column if not exists error_language text not null default '';
alter table public.reports add column if not exists current_value text not null default '';
alter table public.reports add column if not exists suggested_value text not null default '';
alter table public.reports add column if not exists origin_station text not null default '';
alter table public.reports add column if not exists destination_station text not null default '';
alter table public.reports add column if not exists route_snapshot text not null default '';
alter table public.reports add column if not exists route_issue_type text not null default '';
alter table public.reports add column if not exists displayed_fare text not null default '';
alter table public.reports add column if not exists user_reported_fare integer;
alter table public.reports add column if not exists payment_type text not null default '';
alter table public.reports add column if not exists has_location_permission text not null default '';
alter table public.reports add column if not exists facility_issue_type text not null default '';
alter table public.reports add column if not exists page_area text not null default '';
alter table public.reports add column if not exists device_type text not null default '';
alter table public.reports add column if not exists search_snapshot text not null default '';
alter table public.reports add column if not exists honeypot text not null default '';

-- Replace the old body >= 4 rule. Some structured categories deliberately allow an empty description.
alter table public.reports drop constraint if exists reports_body_check;
alter table public.reports drop constraint if exists reports_status_check;
alter table public.reports drop constraint if exists reports_category_check;
alter table public.reports drop constraint if exists reports_field_lengths_check;
alter table public.reports drop constraint if exists reports_category_fields_check;
alter table public.reports drop constraint if exists reports_enum_values_check;
alter table public.reports drop constraint if exists reports_honeypot_check;
alter table public.reports drop constraint if exists reports_fare_check;

alter table public.reports add constraint reports_status_check
  check (status in ('new', 'doing', 'done'));
alter table public.reports add constraint reports_category_check
  check (category_key in ('station_translation', 'route_result', 'fare', 'location', 'facility', 'ui', 'other'));
alter table public.reports add constraint reports_field_lengths_check check (
  char_length(type) <= 80 and char_length(station) <= 160 and char_length(body) <= 5000
  and char_length(contact) <= 160 and char_length(page) <= 500 and char_length(user_agent) <= 800
  and char_length(note) <= 5000 and char_length(station_code) <= 40 and char_length(line_id) <= 40
  and char_length(current_value) <= 1000 and char_length(suggested_value) <= 1000
  and char_length(origin_station) <= 160 and char_length(destination_station) <= 160
  and char_length(route_snapshot) <= 5000 and char_length(displayed_fare) <= 120
  and char_length(search_snapshot) <= 3000
);
alter table public.reports add constraint reports_enum_values_check check (
  error_language in ('', 'zh', 'ko', 'en', 'station_code')
  and route_issue_type in ('', 'not_shortest', 'too_many_transfers', 'unreasonable_time', 'other')
  and payment_type in ('', 'transit_card', 'cash', 'other')
  and has_location_permission in ('', 'yes', 'no', 'unsure')
  and facility_issue_type in ('', 'cannot_open', 'wrong_content', 'outdated', 'other')
  and page_area in ('', 'home', 'station_search', 'route_planner', 'report_form', 'other')
  and device_type in ('', 'mobile', 'tablet', 'desktop')
);
alter table public.reports add constraint reports_category_fields_check check (
  (category_key = 'station_translation' and station <> '' and error_language <> '' and char_length(body) >= 4)
  or (category_key = 'route_result' and origin_station <> '' and destination_station <> '' and route_issue_type <> '' and char_length(body) >= 1)
  or (category_key = 'fare' and origin_station <> '' and destination_station <> '' and displayed_fare <> '')
  or (category_key = 'location' and has_location_permission <> '' and char_length(body) >= 1)
  or (category_key = 'facility' and station <> '' and facility_issue_type <> '')
  or (category_key = 'ui' and page_area <> '' and device_type <> '' and char_length(body) >= 4)
  or (category_key = 'other' and char_length(body) >= 4)
);
alter table public.reports add constraint reports_honeypot_check check (honeypot = '');
alter table public.reports add constraint reports_fare_check
  check (user_reported_fare is null or user_reported_fare between 0 and 100000);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  visit_date date not null,
  session_id text not null,
  created_at timestamptz not null default now(),
  constraint visits_session_id_check check (
    char_length(session_id) between 16 and 80
    and session_id ~ '^[A-Za-z0-9_-]+$'
  ),
  constraint visits_date_session_unique unique (visit_date, session_id)
);

create index if not exists visits_visit_date_idx on public.visits (visit_date);

alter table public.reports enable row level security;
alter table public.admin_users enable row level security;
alter table public.visits enable row level security;

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

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.get_visit_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  today date := (timezone('Asia/Seoul', now()))::date;
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'administrator access required' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'today_visits', (select count(*) from public.visits where visit_date = today),
    'today_unique', (select count(distinct session_id) from public.visits where visit_date = today),
    'last_7_days', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'visit_date', days.day::date,
        'unique_visitors', coalesce(counts.unique_visitors, 0)
      ) order by days.day), '[]'::jsonb)
      from generate_series(today - 6, today, interval '1 day') as days(day)
      left join (
        select visit_date, count(distinct session_id) as unique_visitors
        from public.visits
        where visit_date between today - 6 and today
        group by visit_date
      ) counts on counts.visit_date = days.day::date
    )
  ) into result;
  return result;
end;
$$;

revoke all on function public.get_visit_stats() from public, anon;
grant execute on function public.get_visit_stats() to authenticated;

drop policy if exists "Anyone can submit a report" on public.reports;
drop policy if exists "Administrators can read reports" on public.reports;
drop policy if exists "Administrators can update reports" on public.reports;
drop policy if exists "Administrators can delete reports" on public.reports;
drop policy if exists "Anyone can count a visit" on public.visits;
drop policy if exists "Administrators can read visits" on public.visits;

create policy "Anyone can submit a report"
on public.reports for insert
to anon, authenticated
with check (
  honeypot = ''
  and category_key in ('station_translation', 'route_result', 'fare', 'location', 'facility', 'ui', 'other')
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

create policy "Anyone can count a visit"
on public.visits for insert
to anon, authenticated
with check (visit_date = (timezone('Asia/Seoul', now()))::date);

create policy "Administrators can read visits"
on public.visits for select
to authenticated
using ((select public.is_admin()));

-- Keep public permissions narrow. RLS still decides which authenticated users
-- may read/update/delete rows.
revoke all on table public.reports from anon;
grant insert on table public.reports to anon;
grant insert, select, update, delete on table public.reports to authenticated;
revoke all on table public.visits from anon;
grant insert on table public.visits to anon;
grant insert, select on table public.visits to authenticated;

-- After you create your first Auth user, run this in the SQL Editor once:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
