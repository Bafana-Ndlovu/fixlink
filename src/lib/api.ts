import { supabase } from './supabase'
import type { ProviderListing } from './providers'

export type Category = {
  id: number
  name: string
  slug: string
}

export type Review = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
}

export type ProviderDetail = ProviderListing & {
  reviews: Review[]
}

type ServiceRow = {
  id: string
  name: string
  starting_price: number | string | null
  active: boolean
  categories: { name: string; slug: string } | null
}

type ProviderRow = {
  id: string
  business_name: string
  location: string
  description: string | null
  verified: boolean
  services: ServiceRow[] | null
  reviews: Array<{ id: string; rating: number; comment: string | null; created_at: string }> | null
}

const PROVIDER_COLUMNS =
  'id, business_name, location, description, verified, ' +
  'services(id, name, starting_price, active, categories(name, slug)), ' +
  'reviews(id, rating, comment, created_at)'

function toListing(row: ProviderRow): ProviderDetail {
  const reviews = (row.reviews ?? [])
    .map((r) => ({ id: r.id, rating: r.rating, comment: r.comment, createdAt: r.created_at }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return {
    id: row.id,
    businessName: row.business_name,
    location: row.location,
    description: row.description,
    verified: row.verified,
    services: (row.services ?? [])
      .filter((s) => s.active)
      .map((s) => ({
        id: s.id,
        name: s.name,
        // Postgres numeric comes back as a string
        startingPrice: s.starting_price === null ? null : Number(s.starting_price),
        categorySlug: s.categories?.slug ?? '',
        categoryName: s.categories?.name ?? '',
      })),
    ratings: reviews.map((r) => r.rating),
    reviews,
  }
}

export async function fetchProviders(): Promise<ProviderDetail[]> {
  const { data, error } = await supabase.from('providers').select(PROVIDER_COLUMNS)
  if (error) throw error
  return ((data ?? []) as unknown as ProviderRow[]).map(toListing)
}

export async function fetchProvider(id: string): Promise<ProviderDetail | null> {
  const { data, error } = await supabase.from('providers').select(PROVIDER_COLUMNS).eq('id', id).maybeSingle()
  // 22P02 = the id in the URL is not a valid UUID, so there is no such provider
  if (error?.code === '22P02') return null
  if (error) throw error
  return data ? toListing(data as unknown as ProviderRow) : null
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('id, name, slug').eq('active', true).order('id')
  if (error) throw error
  return (data ?? []) as Category[]
}
