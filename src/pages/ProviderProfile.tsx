import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/useAuth'
import { fetchProvider, type ProviderDetail } from '../lib/api'
import { todayIso, validateBookingRequest, type BookingRequest } from '../lib/bookings'
import { formatRand, startingPriceLabel } from '../lib/format'
import { averageRating, lowestPrice, providerCategories } from '../lib/providers'
import { supabase } from '../lib/supabase'

export default function ProviderProfile() {
  const { id = '' } = useParams()
  const [provider, setProvider] = useState<ProviderDetail | null | undefined>(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchProvider(id)
      .then((data) => {
        if (!cancelled) setProvider(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this provider.')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (error) return <p className="mx-auto max-w-3xl px-6 py-24 text-center text-danger">{error}</p>
  if (provider === undefined) {
    return (
      <div className="py-24">
        <Spinner label="Loading provider" />
      </div>
    )
  }
  if (provider === null) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl">Provider not found</h1>
        <Link to="/browse" className="mt-4 inline-block font-medium text-primary hover:underline">
          Browse all professionals
        </Link>
      </div>
    )
  }

  const rating = averageRating(provider.ratings)

  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link to="/browse" className="hover:text-primary">
            Browse Services
          </Link>{' '}
          / <span className="text-primary-dark">{provider.businessName}</span>
        </nav>

        <header className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start gap-5">
            <span className="bg-brand-gradient flex h-20 w-20 items-center justify-center rounded-2xl font-heading text-2xl font-semibold text-white">
              {provider.businessName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl">{provider.businessName}</h1>
                {provider.verified && <Badge variant="verified">Verified Provider</Badge>}
              </div>
              <p className="mt-1 text-slate-500">{provider.location}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {providerCategories(provider).map((name) => (
                  <Badge key={name}>{name}</Badge>
                ))}
              </div>
              <div className="mt-3">
                {rating !== null ? (
                  <StarRating rating={rating} reviewCount={provider.ratings.length} size="md" />
                ) : (
                  <p className="text-sm text-slate-500">No reviews yet</p>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg">About</h2>
              <p className="mt-2">{provider.description || 'This provider has not added a description yet.'}</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg">Services &amp; Pricing</h2>
              {provider.services.length === 0 ? (
                <p className="mt-2 text-slate-500">No services listed yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {provider.services.map((service) => (
                    <li key={service.id} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <p className="font-medium text-primary-dark">{service.name}</p>
                        <p className="text-sm text-slate-500">{service.categoryName}</p>
                      </div>
                      <p className="font-heading font-semibold whitespace-nowrap text-primary-dark">
                        {service.startingPrice !== null ? `From ${formatRand(service.startingPrice)}` : 'On request'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg">Customer Reviews</h2>
              {provider.reviews.length === 0 ? (
                <p className="mt-2 text-slate-500">No reviews yet. Reviews come only from completed bookings.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {provider.reviews.map((review) => (
                    <li key={review.id} className="py-4">
                      <div className="flex items-center justify-between gap-3">
                        <StarRating rating={review.rating} showValue={false} />
                        <span className="text-xs text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString('en-ZA')} · Verified booking
                        </span>
                      </div>
                      {review.comment && <p className="mt-2">{review.comment}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <BookingCard provider={provider} />
        </div>
      </div>
    </div>
  )
}

function BookingCard({ provider }: { provider: ProviderDetail }) {
  const { profile } = useAuth()
  const location = useLocation()
  const today = todayIso()
  const [values, setValues] = useState<BookingRequest>({
    serviceId: provider.services[0]?.id ?? '',
    description: '',
    address: '',
    preferredDate: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof BookingRequest, string>>>({})
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateBookingRequest(values, today)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0 || !profile) return

    setSending(true)
    const { error } = await supabase.from('bookings').insert({
      customer_id: profile.id,
      provider_id: provider.id,
      service_id: values.serviceId || null,
      description: values.description.trim(),
      address: values.address.trim(),
      preferred_date: values.preferredDate || null,
    })
    setSending(false)
    if (error) setFormError('Could not send your request. Please try again.')
    else setSent(true)
  }

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-md lg:sticky lg:top-24">
      <p className="font-heading text-2xl font-semibold text-primary-dark">{startingPriceLabel(lowestPrice(provider.services))}</p>
      <p className="text-sm text-slate-500">Free to request a quote</p>

      {sent ? (
        <div className="mt-5 rounded-xl bg-success/10 p-4">
          <p className="font-medium text-success">Request sent!</p>
          <p className="mt-1 text-sm">
            {provider.businessName} will accept or decline it. Follow its status on your dashboard.
          </p>
          <Link to="/dashboard" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Go to my bookings
          </Link>
        </div>
      ) : !profile ? (
        <div className="mt-5">
          <p className="text-sm">Log in as a customer to request a quote or book this provider.</p>
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="bg-brand-gradient mt-4 block rounded-lg px-4 py-3 text-center text-sm font-medium text-white hover:opacity-90"
          >
            Log in to book
          </Link>
          <Link to="/signup" className="mt-2 block text-center text-sm font-medium text-primary hover:underline">
            New here? Create an account
          </Link>
        </div>
      ) : profile.role !== 'customer' ? (
        <p className="mt-5 rounded-xl bg-surface p-4 text-sm">Only customer accounts can book providers.</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          <h2 className="text-lg">Request a booking</h2>
          {formError && (
            <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
              {formError}
            </p>
          )}
          {provider.services.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="service" className="text-sm font-medium text-primary-dark">
                Service
              </label>
              <select
                id="service"
                value={values.serviceId}
                onChange={(e) => setValues({ ...values, serviceId: e.target.value })}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              >
                {provider.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-primary-dark">
              What needs doing?
            </label>
            <textarea
              id="description"
              rows={3}
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
              aria-invalid={errors.description ? true : undefined}
              placeholder="e.g. Geyser is leaking into the ceiling"
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
            {errors.description && <p className="text-xs text-danger">{errors.description}</p>}
          </div>
          <Input
            label="Address or area"
            placeholder="e.g. 12 Vilakazi St, Orlando West"
            value={values.address}
            onChange={(e) => setValues({ ...values, address: e.target.value })}
            error={errors.address}
          />
          <Input
            label="Preferred date (optional)"
            type="date"
            min={today}
            value={values.preferredDate}
            onChange={(e) => setValues({ ...values, preferredDate: e.target.value })}
            error={errors.preferredDate}
          />
          <Button type="submit" variant="gradient" size="lg" fullWidth disabled={sending}>
            {sending ? 'Sending…' : 'Book Now'}
          </Button>
        </form>
      )}
    </aside>
  )
}
