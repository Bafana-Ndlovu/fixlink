import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  providers: { business_name: string } | null
}

export default function CustomerDashboard() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<BookingRow[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Row Level Security only returns this customer's own bookings.
    supabase
      .from('bookings')
      .select('id, description, status, preferred_date, providers(business_name)')
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) setError('Could not load your bookings.')
        else setBookings((data ?? []) as unknown as BookingRow[])
      })
  }, [])

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
              <li key={booking.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-medium text-primary-dark">{booking.providers?.business_name ?? 'Provider'}</p>
                  <p className="text-sm text-slate-500">
                    {booking.description}
                    {booking.preferred_date && ` · ${booking.preferred_date}`}
                  </p>
                </div>
                <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusClass[booking.status])}>
                  {statusLabel[booking.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
