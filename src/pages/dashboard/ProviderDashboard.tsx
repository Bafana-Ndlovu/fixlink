import { useEffect, useState, type FormEvent } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Spinner from '../../components/Spinner'
import StatCard from '../../components/StatCard'
import { useAuth } from '../../context/useAuth'
import { statusClass, statusLabel, summarizeBookings, type BookingStatus } from '../../lib/bookings'
import { cn } from '../../lib/cn'
import { supabase } from '../../lib/supabase'

type Business = {
  id: string
  business_name: string
  location: string
  description: string | null
  verified: boolean
}

type RequestRow = {
  id: string
  description: string
  address: string
  status: BookingStatus
  preferred_date: string | null
}

// Loads the provider's business and the bookings made with it.
async function loadProviderData(profileId: string): Promise<{
  business: Business | null
  requests: RequestRow[]
  error?: string
}> {
  const { data, error } = await supabase
    .from('providers')
    .select('id, business_name, location, description, verified')
    .eq('profile_id', profileId)
    .maybeSingle()
  if (error) return { business: null, requests: [], error: 'Could not load your business profile.' }
  if (!data) return { business: null, requests: [] }

  const { data: rows } = await supabase
    .from('bookings')
    .select('id, description, address, status, preferred_date')
    .eq('provider_id', data.id)
    .order('created_at', { ascending: false })
  return { business: data as Business, requests: (rows ?? []) as RequestRow[] }
}

export default function ProviderDashboard() {
  const { profile } = useAuth()
  const [business, setBusiness] = useState<Business | null | undefined>(undefined)
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [error, setError] = useState('')

  const [reloadKey, setReloadKey] = useState(0)
  const reload = () => setReloadKey((key) => key + 1)

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    loadProviderData(profile.id).then((result) => {
      if (cancelled) return
      if (result.error) {
        setError(result.error)
        return
      }
      setBusiness(result.business)
      setRequests(result.requests)
    })
    return () => {
      cancelled = true
    }
  }, [profile, reloadKey])

  const updateStatus = async (id: string, status: BookingStatus) => {
    const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (updateError) setError('Could not update the booking.')
    else reload()
  }

  if (error) return <p className="text-danger">{error}</p>
  if (business === undefined) return <Spinner label="Loading your business" />
  if (business === null) return <BusinessSetup onCreated={reload} />

  const summary = summarizeBookings(requests)
  const firstName = profile?.fullName.split(' ')[0] || 'there'

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl sm:text-3xl">Good day, {firstName}</h1>
      <p className="mt-1 text-slate-500">
        {business.business_name} · {business.location}{' '}
        <span
          className={cn(
            'ml-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
            business.verified ? 'bg-success/15 text-success' : 'bg-warning/15 text-amber-700',
          )}
        >
          {business.verified ? 'Verified' : 'Verification pending'}
        </span>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total bookings" value={summary.total} />
        <StatCard label="Pending requests" value={summary.pending} tone="warning" />
        <StatCard label="Accepted" value={summary.accepted} tone="accent" />
        <StatCard label="Completed jobs" value={summary.completed} tone="success" />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg">Customer requests</h2>
        {requests.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No requests yet. They'll appear here when customers book you.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {requests.map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-primary-dark">{request.description}</p>
                  <p className="text-sm text-slate-500">
                    {request.address}
                    {request.preferred_date && ` · ${request.preferred_date}`}
                  </p>
                </div>
                {request.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => updateStatus(request.id, 'accepted')}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(request.id, 'cancelled')}>
                      Decline
                    </Button>
                  </div>
                ) : request.status === 'accepted' ? (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(request.id, 'completed')}>
                    Mark completed
                  </Button>
                ) : (
                  <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusClass[request.status])}>
                    {statusLabel[request.status]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

// First-time providers create their business profile here.
function BusinessSetup({ onCreated }: { onCreated: () => void }) {
  const { profile } = useAuth()
  const [values, setValues] = useState({ businessName: '', location: '', description: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!values.businessName.trim() || !values.location.trim()) {
      setError('Business name and location are required.')
      return
    }
    setSaving(true)
    const { error: insertError } = await supabase.from('providers').insert({
      profile_id: profile?.id,
      business_name: values.businessName.trim(),
      location: values.location.trim(),
      description: values.description.trim() || null,
    })
    setSaving(false)
    if (insertError) setError('Could not save your business. Please try again.')
    else onCreated()
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl">Set up your business</h1>
      <p className="mt-1 text-slate-500">Tell customers who you are. An admin will verify your business.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
        <Input
          label="Business name"
          placeholder="e.g. Thabo's Plumbing Solutions"
          value={values.businessName}
          onChange={(e) => setValues({ ...values, businessName: e.target.value })}
        />
        <Input
          label="Location"
          placeholder="e.g. Soweto, Johannesburg"
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-primary-dark">
            About your business
          </label>
          <textarea
            id="description"
            rows={4}
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />
        </div>
        <Button type="submit" variant="gradient" size="lg" disabled={saving}>
          {saving ? 'Saving…' : 'Save business profile'}
        </Button>
      </form>
    </div>
  )
}
