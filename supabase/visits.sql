-- Visitor counting migration. Run after schema.sql has created is_admin().
-- Dates use Korea Standard Time and session identifiers are never exposed to anon.

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
alter table public.visits enable row level security;

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

drop policy if exists "Anyone can count a visit" on public.visits;
drop policy if exists "Administrators can read visits" on public.visits;

create policy "Anyone can count a visit"
on public.visits for insert
to anon, authenticated
with check (visit_date = (timezone('Asia/Seoul', now()))::date);

create policy "Administrators can read visits"
on public.visits for select
to authenticated
using ((select public.is_admin()));

revoke all on table public.visits from anon;
grant insert on table public.visits to anon;
grant insert, select on table public.visits to authenticated;
