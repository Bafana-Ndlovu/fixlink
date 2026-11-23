-- FixLink initial schema: roles, marketplace tables and Row Level Security.

-- ROLES ---------------------------------------------------------------
create type public.user_role as enum ('customer', 'provider', 'admin');
create type public.booking_status as enum ('pending', 'accepted', 'completed', 'cancelled');

-- PROFILES (one per auth user) ------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Create a profile on sign-up. Users may choose customer or provider; never admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    case when requested = 'provider' then 'provider'::public.user_role else 'customer'::public.user_role end,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used in policies.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- MARKETPLACE TABLES ----------------------------------------------------
create table public.categories (
  id serial primary key,
  name text not null unique,
  slug text not null unique,
  icon text,
  active boolean not null default true
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  business_name text not null,
  description text,
  location text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  category_id int not null references public.categories (id),
  name text not null,
  starting_price numeric(10, 2) check (starting_price >= 0),
  active boolean not null default true
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  description text not null,
  address text not null,
  preferred_date date,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings (id) on delete cascade,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- ROW LEVEL SECURITY ----------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.providers  enable row level security;
alter table public.services   enable row level security;
alter table public.bookings   enable row level security;
alter table public.reviews    enable row level security;

-- profiles: see and edit your own; admins see all. Role cannot be changed by the user.
create policy "own profile read"    on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "own profile update"  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy "admin manages profiles" on public.profiles for update using (public.is_admin());

-- categories: everyone reads active ones; admins manage.
create policy "read categories"   on public.categories for select using (active or public.is_admin());
create policy "admin categories"  on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- providers: public directory; providers manage their own business; only admins verify.
create policy "read providers"    on public.providers for select using (true);
create policy "provider creates own business" on public.providers for insert
  with check (profile_id = auth.uid() and verified = false
              and exists (select 1 from public.profiles where id = auth.uid() and role = 'provider'));
create policy "provider updates own business" on public.providers for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid() and verified = (select p.verified from public.providers p where p.id = providers.id));
create policy "admin manages providers" on public.providers for all using (public.is_admin()) with check (public.is_admin());

-- services: public read; providers manage their own.
create policy "read services" on public.services for select using (active or public.is_admin()
  or provider_id in (select id from public.providers where profile_id = auth.uid()));
create policy "provider manages own services" on public.services for all
  using (provider_id in (select id from public.providers where profile_id = auth.uid()))
  with check (provider_id in (select id from public.providers where profile_id = auth.uid()));

-- bookings: customer and the booked provider can see it; customers create; provider updates status.
create policy "read own bookings" on public.bookings for select using (
  customer_id = auth.uid()
  or provider_id in (select id from public.providers where profile_id = auth.uid())
  or public.is_admin());
create policy "customer creates booking" on public.bookings for insert
  with check (customer_id = auth.uid() and status = 'pending');
create policy "customer cancels own booking" on public.bookings for update
  using (customer_id = auth.uid()) with check (customer_id = auth.uid() and status in ('pending', 'cancelled'));
create policy "provider updates booking status" on public.bookings for update
  using (provider_id in (select id from public.providers where profile_id = auth.uid()))
  with check (provider_id in (select id from public.providers where profile_id = auth.uid()));

-- reviews: public read (unless hidden); only the customer of a completed booking can review; admins moderate.
create policy "read visible reviews" on public.reviews for select using (not hidden or public.is_admin());
create policy "customer reviews completed booking" on public.reviews for insert with check (
  customer_id = auth.uid()
  and exists (select 1 from public.bookings b
              where b.id = booking_id and b.customer_id = auth.uid()
                and b.provider_id = reviews.provider_id and b.status = 'completed'));
create policy "admin moderates reviews" on public.reviews for update using (public.is_admin());

-- SEED CATEGORIES -------------------------------------------------------
insert into public.categories (name, slug, icon) values
  ('Plumbing', 'plumbing', 'droplet'),
  ('Electrical', 'electrical', 'zap'),
  ('Cleaning', 'cleaning', 'sparkles'),
  ('Painting', 'painting', 'paintbrush'),
  ('Gardening', 'gardening', 'leaf'),
  ('Handyman Services', 'handyman', 'wrench');
