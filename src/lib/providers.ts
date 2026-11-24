export type ServiceListing = {
  id: string
  name: string
  startingPrice: number | null
  categorySlug: string
  categoryName: string
}

export type ProviderListing = {
  id: string
  businessName: string
  location: string
  description: string | null
  verified: boolean
  services: ServiceListing[]
  ratings: number[]
}

export type ProviderFilters = {
  query: string
  location: string
  category: string
  minRating: number
  verifiedOnly: boolean
}

export type SortOption = 'recommended' | 'rating' | 'reviews' | 'price'

export const emptyFilters: ProviderFilters = {
  query: '',
  location: '',
  category: '',
  minRating: 0,
  verifiedOnly: false,
}

/** Average star rating rounded to one decimal, or null when there are no reviews. */
export function averageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null
  const sum = ratings.reduce((total, rating) => total + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

/** Cheapest "from" price across a provider's services, or null if none are priced. */
export function lowestPrice(services: ServiceListing[]): number | null {
  const prices = services.map((s) => s.startingPrice).filter((p): p is number => p !== null)
  return prices.length > 0 ? Math.min(...prices) : null
}

export function filterProviders(providers: ProviderListing[], filters: ProviderFilters): ProviderListing[] {
  const query = filters.query.trim().toLowerCase()
  const location = filters.location.trim().toLowerCase()

  return providers.filter((provider) => {
    if (filters.verifiedOnly && !provider.verified) return false
    if (location && !provider.location.toLowerCase().includes(location)) return false
    if (filters.category && !provider.services.some((s) => s.categorySlug === filters.category)) return false
    if (filters.minRating > 0) {
      const rating = averageRating(provider.ratings)
      if (rating === null || rating < filters.minRating) return false
    }
    if (query) {
      const haystack = [
        provider.businessName,
        provider.description ?? '',
        ...provider.services.map((s) => `${s.name} ${s.categoryName}`),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function sortProviders(providers: ProviderListing[], sort: SortOption): ProviderListing[] {
  const sorted = [...providers]
  const rating = (p: ProviderListing) => averageRating(p.ratings) ?? 0
  const price = (p: ProviderListing) => lowestPrice(p.services) ?? Number.POSITIVE_INFINITY

  switch (sort) {
    case 'rating':
      return sorted.sort((a, b) => rating(b) - rating(a))
    case 'reviews':
      return sorted.sort((a, b) => b.ratings.length - a.ratings.length)
    case 'price':
      return sorted.sort((a, b) => price(a) - price(b))
    default:
      // Recommended: verified first, then best rated, then most reviewed
      return sorted.sort(
        (a, b) =>
          Number(b.verified) - Number(a.verified) || rating(b) - rating(a) || b.ratings.length - a.ratings.length,
      )
  }
}

export function paginate<T>(items: T[], page: number, perPage: number): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const current = Math.min(Math.max(1, page), totalPages)
  return { items: items.slice((current - 1) * perPage, current * perPage), totalPages }
}

/** Distinct category names a provider offers, for the card's tags. */
export function providerCategories(provider: ProviderListing): string[] {
  return [...new Set(provider.services.map((s) => s.categoryName))]
}
