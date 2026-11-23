import { describe, expect, it } from 'vitest'
import { summarizeBookings } from './bookings'

describe('summarizeBookings', () => {
  it('returns zeros when there are no bookings', () => {
    expect(summarizeBookings([])).toEqual({ total: 0, pending: 0, accepted: 0, completed: 0, cancelled: 0 })
  })

  it('counts bookings by status', () => {
    const summary = summarizeBookings([
      { status: 'pending' },
      { status: 'pending' },
      { status: 'completed' },
      { status: 'cancelled' },
    ])
    expect(summary).toEqual({ total: 4, pending: 2, accepted: 0, completed: 1, cancelled: 1 })
  })
})
