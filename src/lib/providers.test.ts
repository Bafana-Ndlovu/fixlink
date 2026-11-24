import { describe, expect, it } from 'vitest'
import {
  averageRating,
  emptyFilters,
  filterProviders,
  lowestPrice,
  paginate,
  providerCategories,
  sortProviders,
  type ProviderListing,
} from './providers'

const thabo: ProviderListing = {
  id: '1',
  businessName: "Thabo's Plumbing Solutions",
  location: 'Soweto, Johannesburg',
  description: 'Geysers, burst pipes and blocked drains',
  verified: true,
  services: [
    { id: 's1', name: 'Leak repair', startingPrice: 350, categorySlug: 'plumbing', categoryName: 'Plumbing' },
    { id: 's2', name: 'Geyser installation', startingPrice: 6500, categorySlug: 'plumbing', categoryName: 'Plumbing' },
  ],
  ratings: [5, 5, 4],
}

const spark: ProviderListing = {
  id: '2',
  businessName: 'BrightSpark Electrical',
  location: 'Sandton, Johannesburg',
  description: null,
  verified: false,
  services: [{ id: 's3', name: 'DB board repair', startingPrice: 450, categorySlug: 'electrical', categoryName: 'Electrical' }],
  ratings: [4, 3, 4, 5, 4],
}

const clean: ProviderListing = {
  id: '3',
  businessName: 'Sparkle Clean Co.',
  location: 'Durban North',
  description: 'Home and office cleaning',
  verified: true,
  services: [{ id: 's4', name: 'Deep clean', startingPrice: null, categorySlug: 'cleaning', categoryName: 'Cleaning' }],
  ratings: [],
}

const all = [thabo, spark, clean]

describe('averageRating', () => {
  it('averages to one decimal', () => {
    expect(averageRating([5, 5, 4])).toBe(4.7)
  })

  it('returns null without reviews', () => {
    expect(averageRating([])).toBeNull()
  })
})

describe('lowestPrice', () => {
  it('finds the cheapest priced service', () => {
    expect(lowestPrice(thabo.services)).toBe(350)
  })

  it('returns null when no service has a price', () => {
    expect(lowestPrice(clean.services)).toBeNull()
  })
})

describe('filterProviders', () => {
  it('returns everyone with empty filters', () => {
    expect(filterProviders(all, emptyFilters)).toHaveLength(3)
  })

  it('searches business names, descriptions and services', () => {
    expect(filterProviders(all, { ...emptyFilters, query: 'geyser' })).toEqual([thabo])
    expect(filterProviders(all, { ...emptyFilters, query: 'office' })).toEqual([clean])
  })

  it('filters by location, ignoring case', () => {
    expect(filterProviders(all, { ...emptyFilters, location: 'johannesburg' })).toEqual([thabo, spark])
  })

  it('filters by category', () => {
    expect(filterProviders(all, { ...emptyFilters, category: 'electrical' })).toEqual([spark])
  })

  it('filters by minimum rating and leaves out unrated providers', () => {
    expect(filterProviders(all, { ...emptyFilters, minRating: 4.5 })).toEqual([thabo])
  })

  it('can show verified providers only', () => {
    expect(filterProviders(all, { ...emptyFilters, verifiedOnly: true })).toEqual([thabo, clean])
  })
})

describe('sortProviders', () => {
  it('sorts by rating', () => {
    expect(sortProviders(all, 'rating').map((p) => p.id)).toEqual(['1', '2', '3'])
  })

  it('sorts by number of reviews', () => {
    expect(sortProviders(all, 'reviews').map((p) => p.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by lowest price, unpriced last', () => {
    expect(sortProviders(all, 'price').map((p) => p.id)).toEqual(['1', '2', '3'])
  })

  it('puts verified providers first when recommended', () => {
    expect(sortProviders(all, 'recommended').map((p) => p.id)).toEqual(['1', '3', '2'])
  })

  it('does not change the original list', () => {
    sortProviders(all, 'rating')
    expect(all.map((p) => p.id)).toEqual(['1', '2', '3'])
  })
})

describe('paginate', () => {
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1)

  it('returns the requested page', () => {
    expect(paginate(numbers, 2, 9)).toEqual({ items: [10, 11, 12, 13, 14, 15, 16, 17, 18], totalPages: 3 })
  })

  it('keeps the page within range', () => {
    expect(paginate(numbers, 99, 9).items).toEqual([19, 20])
    expect(paginate([], 1, 9)).toEqual({ items: [], totalPages: 1 })
  })
})

describe('providerCategories', () => {
  it('lists each category once', () => {
    expect(providerCategories(thabo)).toEqual(['Plumbing'])
  })
})
