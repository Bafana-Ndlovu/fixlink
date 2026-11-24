import { describe, expect, it } from 'vitest'
import { summarizeBookings, todayIso, validateBookingRequest } from './bookings'

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

describe('validateBookingRequest', () => {
  const valid = {
    serviceId: 's1',
    description: 'Geyser is leaking into the ceiling',
    address: '12 Vilakazi St, Orlando West',
    preferredDate: '2026-12-01',
  }

  it('accepts a complete request', () => {
    expect(validateBookingRequest(valid, '2026-11-24')).toEqual({})
  })

  it('allows leaving the date empty', () => {
    expect(validateBookingRequest({ ...valid, preferredDate: '' }, '2026-11-24')).toEqual({})
  })

  it('needs a real description and address', () => {
    const errors = validateBookingRequest({ ...valid, description: 'fix', address: '' }, '2026-11-24')
    expect(errors.description).toBeDefined()
    expect(errors.address).toBeDefined()
  })

  it('rejects dates in the past', () => {
    expect(validateBookingRequest({ ...valid, preferredDate: '2026-11-01' }, '2026-11-24').preferredDate).toBeDefined()
  })
})

describe('todayIso', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(todayIso(new Date(2026, 10, 24, 15, 30))).toBe('2026-11-24')
  })
})
