import { Link } from 'react-router-dom'
import { startingPriceLabel } from '../lib/format'
import { averageRating, lowestPrice, providerCategories, type ProviderListing } from '../lib/providers'
import Badge from './Badge'
import StarRating from './StarRating'

// Initials avatar in brand colours, e.g. "Thabo's Plumbing" -> "TP"
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

export default function ProviderCard({ provider }: { provider: ProviderListing }) {
  const rating = averageRating(provider.ratings)
  const categories = providerCategories(provider)

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="bg-brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-heading text-lg font-semibold text-white">
          {initials(provider.businessName)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base">{provider.businessName}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {provider.location}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {provider.verified && <Badge variant="verified">Verified</Badge>}
        {categories.map((name) => (
          <Badge key={name}>{name}</Badge>
        ))}
      </div>

      {provider.description && <p className="mt-3 line-clamp-2 text-sm">{provider.description}</p>}

      <div className="mt-auto pt-4">
        {rating !== null ? (
          <StarRating rating={rating} reviewCount={provider.ratings.length} />
        ) : (
          <p className="text-sm text-slate-500">New on FixLink</p>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-heading font-semibold text-primary-dark">{startingPriceLabel(lowestPrice(provider.services))}</p>
          <Link
            to={`/providers/${provider.id}`}
            className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  )
}
