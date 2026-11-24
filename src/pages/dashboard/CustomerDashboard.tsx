import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import Spinner from '../../components/Spinner'
import StatCard from '../../components/StatCard'
import { useAuth } from '../../context/useAuth'
import { statusClass, statusLabel, summarizeBookings, type BookingStatus } from '../../lib/bookings'
import { cn } from '../../lib/cn'
import { supabase } from '../../lib/supabase'

type BookingRow = {
  id: string
  description: string
  status: BookingStatus
  preferred_date: string | null
  provider_id: string
  providers: { business_name: string } | null
  // One-to-one relation: Supabase may return an object, an array or null
  reviews: { id: string } | Array<{ id: string }> | null
}

function hasReview(booking: BookingRow) {
  return Array.isArray(booking.reviews) ? booking.reviews.length > 0 : booking.reviews !== null
}

export default function CustomerDashboard() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<BookingRow[] | null>(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [reviewing, setReviewing] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    // Row Level Security only returns this customer's own bookings.
    supabase
      .from('bookings')
      .select('id, description, status, preferred_date, provider_id, providers(business_name), reviews(id)')
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) setError('Could not load your bookings.')
        else setBookings((data ?? []) as unknown as BookingRow[])
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const reload = () => setReloadKey((key) => key + 1)

  const cancelBooking = async (id: string) => {
    const { error: updateError } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    if (updateError) setError('Could not cancel the booking.')
    else reload()
  }

  const firstName = profile?.fullName.split(' ')[0] || 'there'
  const summary = summarizeBookings(bookings ?? [])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">Welcome back, {firstName}</h1>
          <p className="mt-1 text-slate-500">Here's what's happening with your bookings.</p>
        </div>
        <Link
          to="/browse"
          className="bg-brand-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          + Book a Service
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total bookings" value={summary.total} />
        <StatCard label="Pending" value={summary.pending} tone="warning" />
        <StatCard label="Accepted" value={summary.accepted} tone="accent" />
        <StatCard label="Completed" value={summary.completed} tone="success" />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg">Booking history</h2>
        {error && <p className="mt-4 text-danger">{error}</p>}
        {!bookings && !error && (
          <div className="py-10">
            <Spinner label="Loading bookings" />
          </div>
        )}
        {bookings && bookings.length === 0 && (
          <div className="py-10 text-center">
            <p>You haven't booked anything yet.</p>
            <Link to="/browse" className="mt-2 inline-block font-medium text-primary hover:underline">
              Find a professional
            </Link>
          </div>
        )}
        {bookings && bookings.length > 0 && (
          <ul className="mt-4 divide-y divide-slate-100">
            {bookings.map((booking) => (
              <li key={booking.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link
                      to={`/providers/${booking.provider_id}`}
                      className="font-medium text-primary-dark hover:text-primary"
                    >
                      {booking.providers?.business_name ?? 'Provider'}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {booking.description}
                      {booking.preferred_date && ` · ${booking.preferred_date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {booking.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking.id)}
                        className="text-sm font-medium text-danger hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'completed' && !hasReview(booking) && reviewing !== booking.id && (
                      <Button size="sm" variant="outline" onClick={() => setReviewing(booking.id)}>
                        Leave review
                      </Button>
                    )}
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusClass[booking.status])}>
                      {statusLabel[booking.status]}
                    </span>
                  </div>
                </div>
                {reviewing === booking.id && profile && (
                  <ReviewForm
                    booking={booking}
                    customerId={profile.id}
                    onDone={() => {
                      setReviewing(null)
                      reload()
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

type ReviewFormProps = {
  booking: BookingRow
  customerId: string
  onDone: () => void
}

// Only completed bookings can be reviewed (enforced by the database too).
function ReviewForm({ booking, customerId, onDone }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (rating < 1) {
      setError('Choose a star rating.')
      return
    }
    setSaving(true)
    const { error: insertError } = await supabase.from('reviews').insert({
      booking_id: booking.id,
      customer_id: customerId,
      provider_id: booking.provider_id,
      rating,
      comment: comment.trim() || null,
    })
    setSaving(false)
    if (insertError) setError('Could not save your review.')
    else onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-xl bg-surface p-4">
      <fieldset>
        <legend className="text-sm font-medium text-primary-dark">Rate {booking.providers?.business_name}</legend>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              aria-pressed={rating === star}
              className={cn('text-2xl', star <= rating ? 'text-warning' : 'text-slate-300')}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label htmlFor={`comment-${booking.id}`} className="mt-3 block text-sm font-medium text-primary-dark">
        Comment (optional)
      </label>
      <textarea
        id={`comment-${booking.id}`}
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Submit review'}
        </Button>
        <Button size="sm" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
