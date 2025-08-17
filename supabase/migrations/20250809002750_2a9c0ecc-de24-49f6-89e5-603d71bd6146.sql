-- Fixing previous failure: CREATE POLICY doesn't support IF NOT EXISTS; using conditional DO blocks

-- Core update timestamp function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policies for profiles
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Profiles are viewable by everyone'
  ) then
    create policy "Profiles are viewable by everyone"
      on public.profiles for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert their own profile'
  ) then
    create policy "Users can insert their own profile"
      on public.profiles for insert
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on public.profiles for update
      using (auth.uid() = id);
  end if;
end$$;

-- Trigger to auto-update updated_at
create or replace trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- LISTINGS (Anonymous listing base)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_title text not null,
  item_description text,
  price_min numeric(10,2),
  price_max numeric(10,2),
  reward_percentage numeric(5,2) default 20.00,
  max_degrees integer not null default 6,
  general_location text,
  seller_rating numeric(2,1),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_listings_user on public.listings(user_id);

alter table public.listings enable row level security;

-- Policies for listings
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'listings' and policyname = 'Listings are viewable by everyone'
  ) then
    create policy "Listings are viewable by everyone"
      on public.listings for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'listings' and policyname = 'Users can insert their own listings'
  ) then
    create policy "Users can insert their own listings"
      on public.listings for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'listings' and policyname = 'Users can update their own listings'
  ) then
    create policy "Users can update their own listings"
      on public.listings for update
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'listings' and policyname = 'Users can delete their own listings'
  ) then
    create policy "Users can delete their own listings"
      on public.listings for delete
      using (auth.uid() = user_id);
  end if;
end$$;

-- Trigger to auto-update updated_at
create or replace trigger trg_listings_updated_at
before update on public.listings
for each row execute function public.update_updated_at_column();

-- REFERRALS (minimal chain step storage)
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  referrer_id uuid not null references auth.users(id) on delete cascade,
  degree integer not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_referrals_listing on public.referrals(listing_id);
create index if not exists idx_referrals_referrer on public.referrals(referrer_id);

alter table public.referrals enable row level security;

-- Policies for referrals
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'referrals' and policyname = 'Referrers and listing owners can view referrals'
  ) then
    create policy "Referrers and listing owners can view referrals"
      on public.referrals for select
      using (
        referrer_id = auth.uid()
        or exists (
          select 1 from public.listings l
          where l.id = referrals.listing_id and l.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'referrals' and policyname = 'Users can create their own referrals'
  ) then
    create policy "Users can create their own referrals"
      on public.referrals for insert
      with check (referrer_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'referrals' and policyname = 'Referrers can delete their own referrals'
  ) then
    create policy "Referrers can delete their own referrals"
      on public.referrals for delete
      using (referrer_id = auth.uid());
  end if;
end$$;