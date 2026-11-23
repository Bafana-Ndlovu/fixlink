import { describe, expect, it } from 'vitest'
import {
  dashboardPathFor,
  friendlyAuthError,
  isValidSaPhone,
  validateLogin,
  validateSignUp,
  type SignUpValues,
} from './auth'

describe('dashboardPathFor', () => {
  it('sends each role to its own dashboard', () => {
    expect(dashboardPathFor('customer')).toBe('/dashboard')
    expect(dashboardPathFor('provider')).toBe('/provider')
    expect(dashboardPathFor('admin')).toBe('/admin')
  })
})

describe('isValidSaPhone', () => {
  it('accepts local and +27 numbers', () => {
    expect(isValidSaPhone('082 123 4567')).toBe(true)
    expect(isValidSaPhone('+27821234567')).toBe(true)
  })

  it('rejects numbers that are too short or not South African', () => {
    expect(isValidSaPhone('08212')).toBe(false)
    expect(isValidSaPhone('+44 7700 900123')).toBe(false)
  })
})

describe('validateLogin', () => {
  it('passes with an email and password', () => {
    expect(validateLogin({ email: 'nomsa@example.co.za', password: 'secret123' })).toEqual({})
  })

  it('flags a bad email and an empty password', () => {
    const errors = validateLogin({ email: 'nomsa', password: '' })
    expect(errors.email).toBeDefined()
    expect(errors.password).toBeDefined()
  })
})

describe('validateSignUp', () => {
  const valid: SignUpValues = {
    fullName: 'Nomsa Dlamini',
    email: 'nomsa@example.co.za',
    phone: '082 123 4567',
    password: 'strongpass1',
    confirmPassword: 'strongpass1',
    role: 'customer',
    acceptTerms: true,
  }

  it('passes for a complete form', () => {
    expect(validateSignUp(valid)).toEqual({})
  })

  it('allows an empty phone number', () => {
    expect(validateSignUp({ ...valid, phone: '' })).toEqual({})
  })

  it('requires matching passwords of at least 8 characters', () => {
    expect(validateSignUp({ ...valid, password: 'short', confirmPassword: 'short' }).password).toBeDefined()
    expect(validateSignUp({ ...valid, confirmPassword: 'different1' }).confirmPassword).toBeDefined()
  })

  it('requires the terms to be accepted', () => {
    expect(validateSignUp({ ...valid, acceptTerms: false }).acceptTerms).toBeDefined()
  })
})

describe('friendlyAuthError', () => {
  it('explains wrong credentials', () => {
    expect(friendlyAuthError('Invalid login credentials')).toBe('Incorrect email or password.')
  })

  it('falls back to a generic message', () => {
    expect(friendlyAuthError('weird server error')).toBe('Something went wrong. Please try again.')
  })
})
