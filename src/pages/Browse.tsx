import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon'
import ProviderCard from '../components/ProviderCard'
import Spinner from '../components/Spinner'
import { fetchProviders } from '../lib/api'
import { serviceCategories } from '../lib/categories'
import { cn } from '../lib/cn'
import { filterProviders, paginate, sortProviders, type ProviderListing, type SortOption } from '../lib/providers'

const PER_PAGE = 9

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'reviews', label: 'Most reviews' },
  { value: 'price', label: 'Lowest price' },
]

const ratingOptions = [0, 4.5, 4, 3.5]

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [providers, setProviders] = useState<ProviderListing[] | null>(null)
  const [error, setError] = useState('')

  // Filters live in the URL so searches can be shared and the back button works
  const filters = {
    query: params.get('q') ?? '',
    location: params.get('location') ?? '',
    category: params.get('category') ?? '',
    minRating: Number(params.get('rating') ?? 0),
    verifiedOnly: params.get('verified') === '1',
  }
  const sort = (params.get('sort') as SortOption | null) ?? 'recommended'
  const page = Number(params.get('page') ?? 1)

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: true })
  }

  useEffect(() => {
    let cancelled = false
    fetchProviders()
      .then((data) => {
        if (!cancelled) setProviders(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load providers. Please refresh the page.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const results = providers ? sortProviders(filterProviders(providers, filters), sort) : []
  const { items, totalPages } = paginate(results, page, PER_PAGE)
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const categoryName = serviceCategories.find((c) => c.slug === filters.category)?.name

  return (
    <div className="bg-surface">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="text-3xl">Browse Services</h1>
          <p className="mt-1">Find verified professionals in your area.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row" role="search">
            <label className="sr-only" htmlFor="browse-query">
              Search services
            </label>
            <input
              id="browse-query"
              value={filters.query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search a service or business, e.g. geyser"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
            <label className="sr-only" htmlFor="browse-location">
              Location
            </label>
            <input
              id="browse-location"
              value={filters.location}
              onChange={(e) => setParam('location', e.target.value)}
              placeholder="Location, e.g. Soweto"
              className="min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none sm:w-64"
            />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setParam('category', '')}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap',
                !filters.category ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white',
              )}
            >
              All
            </button>
            {serviceCategories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setParam('category', category.slug)}
                aria-pressed={filters.category === category.slug}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap',
                  filters.category === category.slug ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white',
                )}
              >
                <CategoryIcon slug={category.slug} className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-base">Filters</h2>
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-primary-dark">Minimum rating</legend>
            <div className="mt-2 flex flex-col gap-2">
              {ratingOptions.map((value) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === value}
                    onChange={() => setParam('rating', value ? String(value) : '')}
                    className="accent-primary"
                  />
                  {value ? `${value}+ stars` : 'Any rating'}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-5 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => setParam('verified', e.target.checked ? '1' : '')}
              className="h-4 w-4 accent-primary"
            />
            Verified providers only
          </label>
        </aside>

        <section aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              {providers ? (
                <>
                  <span className="font-semibold text-primary-dark">{results.length}</span>{' '}
                  {results.length === 1 ? 'professional' : 'professionals'} found
                  {categoryName && ` in ${categoryName}`}
                  {filters.location && ` near ${filters.location}`}
                </>
              ) : (
                'Loading professionals…'
              )}
            </p>
            <label className="flex items-center gap-2 text-sm">
              Sort by
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value === 'recommended' ? '' : e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="mt-8 text-danger">{error}</p>}
          {!providers && !error && (
            <div className="py-20">
              <Spinner label="Loading professionals" />
            </div>
          )}
          {providers && results.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-medium text-primary-dark">No professionals match your search yet.</p>
              <p className="mt-1 text-sm">Try another area or category, or clear the filters.</p>
            </div>
          )}

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setParam('page', String(currentPage - 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  aria-current={number === currentPage ? 'page' : undefined}
                  onClick={() => setParam('page', String(number))}
                  className={cn(
                    'h-9 w-9 rounded-lg text-sm font-medium',
                    number === currentPage ? 'bg-primary text-white' : 'border border-slate-300 bg-white',
                  )}
                >
                  {number}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setParam('page', String(currentPage + 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  )
}
