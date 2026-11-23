-- Give the API roles table access. Row Level Security still decides WHICH rows each user can see.
-- (New Supabase projects no longer grant this automatically.)

grant usage on schema public to anon, authenticated;

-- Public marketplace data: anyone can browse
grant select on public.categories, public.providers, public.services, public.reviews to anon, authenticated;

-- Logged-in users
grant select, update on public.profiles to authenticated;
grant insert, update on public.providers to authenticated;
grant insert, update, delete on public.services to authenticated;
grant select, insert, update on public.bookings to authenticated;
grant insert, update on public.reviews to authenticated;
grant insert, update, delete on public.categories to authenticated;
grant usage, select on sequence public.categories_id_seq to authenticated;

grant execute on function public.is_admin() to anon, authenticated;
