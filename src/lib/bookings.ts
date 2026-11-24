export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled'

export type BookingSummary = {
  total: number
  pending: number
  accepted: number
  completed: number
  cancelled: number
}

/** Counts bookings by status for the dashboard stat cards. */
export function summarizeBookings(bookings: Array<{ status: BookingStatus }>): BookingSummary {
  const summary: BookingSummary = { total: 0, pending: 0, accepted: 0, completed: 0, cancelled: 0 }
  for (const booking of bookings) {
    summary.total += 1
    summary[booking.status] += 1
  }
  return summary
}

export const statusLabel: Record<BookingStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const statusClass: Record<BookingStatus, string> = {
  pending: 'bg-warning/15 text-amber-700',
  accepted: 'bg-primary/10 text-primary',
  completed: 'bg-success/15 text-success',
  cancelled: 'bg-danger/10 text-danger',
}

export type BookingRequest = {
  serviceId: string
  description: string
  address: string
  preferredDate: string
}

/** Checks a booking request before it is sent. `today` is YYYY-MM-DD. */
export function validateBookingRequest(
  values: BookingRequest,
  today: string,
): Partial<Record<keyof BookingRequest, string>> {
  const errors: Partial<Record<keyof BookingRequest, string>> = {}
  if (values.description.trim().length < 10) errors.description = 'Describe the job in at least 10 characters'
  if (values.address.trim().length < 5) errors.address = 'Enter the address or area where the work is needed'
  if (values.preferredDate && values.preferredDate < today) errors.preferredDate = 'Choose today or a future date'
  return errors
}

/** Today's date as YYYY-MM-DD in the user's own time zone. */
export function todayIso(now: Date = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}
