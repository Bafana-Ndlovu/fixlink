import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CategoryIcon from '../components/CategoryIcon'
import ProviderCard from '../components/ProviderCard'
import { fetchProviders } from '../lib/api'
import { serviceCategories } from '../lib/categories'
import { sortProviders, type ProviderListing } from '../lib/providers'

const steps = [
  { title: 'Find a professional', text: 'Search by service and area, and compare verified local pros.' },
  { title: 'Request a quotation', text: 'Describe the job and send a request in under two minutes.' },
  { title: 'Get your job done', text: 'Track your booking, then rate the work when it is finished.' },
]

const reasons = [
  { title: 'Trusted professionals', text: 'Every verified badge is approved by our team after an ID and business check.' },
  { title: 'Easy booking', text: 'Request a job, pick a date and follow its status from your dashboard.' },
  { title: 'Transparent reviews', text: 'Only customers with a completed booking can leave a review.' },
  { title: 'Convenient discovery', text: 'Plumbers, electricians, cleaners and more, all in one place.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [featured, setFeatured] = useState<ProviderListing[]>([])

  useEffect(() => {
    let cancelled = false
    fetchProviders()
      .then((providers) => {
        if (!cancelled) setFeatured(sortProviders(providers, 'recommended').slice(0, 4))
      })
      .catch(() => {
        // The landing page still works without the featured row
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (location.trim()) params.set('location', location.trim())
    navigate(`/browse${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
              Verified local professionals across South Africa
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold sm:text-5xl">
              Find Trusted Professionals.{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Get Things Fixed.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg">
              Connect with reliable local service providers for your home and business. Discover professionals,
              compare services and book with confidence.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-md sm:flex-row"
              role="search"
            >
              <label className="sr-only" htmlFor="hero-query">
                What service do you need?
              </label>
              <input
                id="hero-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What service do you need?"
                className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
              <label className="sr-only" htmlFor="hero-location">
                Your location
              </label>
              <input
                id="hero-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Soweto, Johannesburg"
                className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none sm:border-l sm:border-slate-200"
              />
              <button
                type="submit"
                className="bg-brand-gradient rounded-xl px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Find Services
              </button>
            </form>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {['Verified pros', 'Real reviews', 'Free quotes'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-xs text-success">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Product preview instead of a stock photo */}
          <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
            <div className="bg-brand-gradient absolute -inset-4 rounded-[2rem] opacity-15 blur-2xl" />
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <p className="text-sm font-medium text-slate-500">New booking request</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="bg-brand-gradient flex h-12 w-12 items-center justify-center rounded-xl text-white">
                  <CategoryIcon slug="plumbing" />
                </span>
                <div>
                  <p className="font-heading font-semibold text-primary-dark">Geyser repair</p>
                  <p className="text-sm text-slate-500">Orlando West, Soweto</p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-surface p-3">
                  <dt className="text-slate-500">Preferred date</dt>
                  <dd className="font-medium text-primary-dark">Tue, 09:00</dd>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <dt className="text-slate-500">Starting price</dt>
                  <dd className="font-medium text-primary-dark">From R550</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-success/10 px-4 py-3 text-sm">
                <span className="font-medium text-success">Accepted by provider</span>
                <span className="text-success">✓</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
              <p className="text-sm font-semibold text-primary-dark">Free to request</p>
              <p className="text-xs text-slate-500">No fees to send a quote request</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">Popular Services</h2>
          <p className="mt-2">Choose a category to see professionals near you.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/browse?category=${category.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent transition group-hover:bg-primary group-hover:text-white">
                  <CategoryIcon slug={category.slug} />
                </span>
                <span>
                  <span className="block font-heading font-semibold text-primary-dark">{category.name}</span>
                  <span className="block text-sm text-slate-500">{category.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured providers (real data) */}
      {featured.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl">Top-Rated Professionals</h2>
              <Link to="/browse" className="font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl">How FixLink Works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <span className="bg-brand-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-full font-heading text-lg font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose */}
      <section id="about" className="scroll-mt-20 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl">Why Choose FixLink?</h2>
            <p className="mt-3 max-w-lg">
              Finding a reliable plumber or electrician still runs on WhatsApp groups and word of mouth. FixLink gives
              South African households one trusted place to find, compare and book local professionals.
            </p>
            <Link
              to="/signup"
              className="bg-brand-gradient mt-6 inline-block rounded-lg px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Create a free account
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason.title} className="rounded-2xl border border-slate-200 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">✓</span>
                <h3 className="mt-3 text-base">{reason.title}</h3>
                <p className="mt-1 text-sm">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider call to action */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="bg-brand-gradient mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl px-8 py-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl text-white sm:text-3xl">Are you a service professional?</h2>
            <p className="mt-2 text-white/90">List your business for free and get booking requests from customers near you.</p>
          </div>
          <Link
            to="/signup?role=provider"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent transition hover:bg-white/90"
          >
            Join as a Provider
          </Link>
        </div>
      </section>
    </>
  )
}
