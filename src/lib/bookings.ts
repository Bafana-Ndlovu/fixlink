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
