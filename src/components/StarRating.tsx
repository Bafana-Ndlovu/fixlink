type StarRatingProps = {
  rating: number
  reviewCount?: number
  showValue?: boolean
  size?: 'sm' | 'md'
}

const MAX_STARS = 5

export default function StarRating({
  rating,
  reviewCount,
  showValue = true,
  size = 'sm',
}: StarRatingProps) {
  const rounded = Math.round(rating)
  const starSize = size === 'sm' ? 'text-sm' : 'text-lg'

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={starSize} role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: MAX_STARS }, (_, i) => (
          <span key={i} aria-hidden="true" className={i < rounded ? 'text-warning' : 'text-slate-300'}>
            ★
          </span>
        ))}
      </span>
      {showValue && <span className="text-sm font-semibold text-primary-dark">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-sm text-slate-500">({reviewCount} reviews)</span>
      )}
    </div>
  )
}
