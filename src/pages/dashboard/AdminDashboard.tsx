import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import Spinner from '../../components/Spinner'
import StatCard from '../../components/StatCard'
import { supabase } from '../../lib/supabase'

type PendingProvider = {
  id: string
  business_name: string
  location: string
  created_at: string
}

type Totals = {
  customers: number
  providers: number
  bookings: number
}

// Admins can read every row thanks to the is_admin() policies.
async function loadAdminData(): Promise<{ totals: Totals | null; pending: PendingProvider[]; error?: string }> {
  const [customers, providers, bookings, unverified] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'provider'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase
      .from('providers')
      .select('id, business_name, location, created_at')
      .eq('verified', false)
      .order('created_at', { ascending: true }),
  ])
  if (customers.error || providers.error || bookings.error || unverified.error) {
    return { totals: null, pending: [], error: 'Could not load platform data.' }
  }
  return {
    totals: { customers: customers.count ?? 0, providers: providers.count ?? 0, bookings: bookings.count ?? 0 },
    pending: (unverified.data ?? []) as PendingProvider[],
  }
}

export default function AdminDashboard() {
  const [totals, setTotals] = useState<Totals | null>(null)
  const [pending, setPending] = useState<PendingProvider[]>([])
  const [error, setError] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    loadAdminData().then((result) => {
      if (cancelled) return
      if (result.error) {
        setError(result.error)
        return
      }
      setTotals(result.totals)
      setPending(result.pending)
    })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const approve = async (id: string) => {
    const { error: updateError } = await supabase.from('providers').update({ verified: true }).eq('id', id)
    if (updateError) setError('Could not approve this provider.')
    else setReloadKey((key) => key + 1)
  }

  if (error) return <p className="text-danger">{error}</p>
  if (!totals) return <Spinner label="Loading platform overview" />

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl sm:text-3xl">Platform overview</h1>
      <p className="mt-1 text-slate-500">Customers, providers and verification requests.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Customers" value={totals.customers} />
        <StatCard label="Providers" value={totals.providers} tone="accent" />
        <StatCard label="Bookings" value={totals.bookings} tone="success" />
        <StatCard label="Awaiting verification" value={pending.length} tone="warning" />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg">Provider verification requests</h2>
        {pending.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No providers are waiting for verification.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {pending.map((provider) => (
              <li key={provider.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-primary-dark">{provider.business_name}</p>
                  <p className="text-sm text-slate-500">
                    {provider.location} · joined {new Date(provider.created_at).toLocaleDateString('en-ZA')}
                  </p>
                </div>
                <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => approve(provider.id)}>
                  Approve
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
