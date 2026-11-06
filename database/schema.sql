-- Personalized Travel Itinerary Planner
-- Future Supabase schema (not applied yet).
-- Review and run these statements in the Supabase SQL editor when ready.

-- profiles: app-specific user data linked to auth.users
create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text,
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Authenticated users can access their own profiles"
    on public.profiles
    for all
    to authenticated
    using (id = auth.uid())
    with check (id = auth.uid());

-- trips: one planned journey per user
create table public.trips (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles (id) on delete cascade,
    destination text not null,
    start_date date,
    end_date date,
    preferences jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

alter table public.trips enable row level security;

create policy "Authenticated users can access their own trips"
    on public.trips
    for all
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- itinerary_days: day-by-day structure for a trip
create table public.itinerary_days (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips (id) on delete cascade,
    day_number integer not null,
    title text,
    notes text,
    unique (trip_id, day_number)
);

alter table public.itinerary_days enable row level security;

create policy "Authenticated users can access their own itinerary days"
    on public.itinerary_days
    for all
    to authenticated
    using (
        trip_id in (
            select id
            from public.trips
            where user_id = auth.uid()
        )
    )
    with check (
        trip_id in (
            select id
            from public.trips
            where user_id = auth.uid()
        )
    );

-- activities: places, meals, and experiences on a given day
create table public.activities (
    id uuid primary key default gen_random_uuid(),
    day_id uuid not null references public.itinerary_days (id) on delete cascade,
    title text not null,
    category text,
    start_time time,
    location text,
    sort_order integer not null default 0
);

alter table public.activities enable row level security;

create policy "Authenticated users can access their own activities"
    on public.activities
    for all
    to authenticated
    using (
        day_id in (
            select itinerary_days.id
            from public.itinerary_days
            join public.trips on trips.id = itinerary_days.trip_id
            where trips.user_id = auth.uid()
        )
    )
    with check (
        day_id in (
            select itinerary_days.id
            from public.itinerary_days
            join public.trips on trips.id = itinerary_days.trip_id
            where trips.user_id = auth.uid()
        )
    );
