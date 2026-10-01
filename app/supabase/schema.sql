create extension if not exists "pgcrypto";

create type visit_reason as enum (
  'X-Ray',
  'Electrocardiogram',
  'Cath Lab',
  'Stat Lab'
);

create type visit_status as enum (
  'WAITING',
  'IN_PROGRESS',
  'COMPLETED'
);

create type visit_event_type as enum (
  'CHECKED_IN',
  'ASSIGNED',
  'COMPLETED'
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  epic_user_id text unique not null,
  first_name text,
  last_name text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table visits (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  reason visit_reason not null,
  status visit_status not null default 'WAITING',
  assigned_to uuid references employees(id) on delete set null,
  created_at timestamptz not null default now(),
  assigned_at timestamptz,
  completed_at timestamptz
);

create table visit_events (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null
    references visits(id)
    on delete cascade,
  event_type visit_event_type not null,
  performed_by uuid
    references employees(id)
    on delete set null,
  created_at timestamptz not null default now()
);

create index visits_status_idx
on visits(status);

create index visits_created_at_idx
on visits(created_at);

create index visits_assigned_to_idx
on visits(assigned_to);

create index visits_reason_idx
on visits(reason);

create index visit_events_visit_id_idx
on visit_events(visit_id);

create index visit_events_created_at_idx
on visit_events(created_at);

alter table employees enable row level security;
alter table visits enable row level security;
alter table visit_events enable row level security;

create policy "Anyone can create visits"
on visits
for insert
to anon, authenticated
with check (true);

create policy "Anyone can view visits"
on visits
for select
to anon, authenticated
using (true);

create policy "Authenticated users can update visits"
on visits
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can view employees"
on employees
for select
to authenticated
using (true);

create policy "Authenticated users can insert employees"
on employees
for insert
to authenticated
with check (true);

create policy "Authenticated users can update employees"
on employees
for update
to authenticated
using (true)
with check (true);

create policy "Anyone can insert visit events"
on visit_events
for insert
to anon, authenticated
with check (true);

create policy "Authenticated users can view visit events"
on visit_events
for select
to authenticated
using (true);

alter publication supabase_realtime
add table visits;