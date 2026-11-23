export type Role = 'customer' | 'provider' | 'admin'

/** Where each role lands after logging in. */
export function dashboardPathFor(role: Role): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'provider':
      return '/provider'
    default:
      return '/dashboard'
  }
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export type LoginValues = {
  email: string
  password: string
}

export type SignUpValues = {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: 'customer' | 'provider'
  acceptTerms: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// South African mobile: 0821234567 or +27821234567 (spaces allowed)
const SA_PHONE_PATTERN = /^(\+27|0)[6-8]\d{8}$/

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

export function isValidSaPhone(phone: string): boolean {
  return SA_PHONE_PATTERN.test(phone.replace(/\s/g, ''))
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {}
  if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address'
  if (!values.password) errors.password = 'Please enter your password'
  return errors
}

export function validateSignUp(values: SignUpValues): FieldErrors<SignUpValues> {
  const errors: FieldErrors<SignUpValues> = {}
  if (values.fullName.trim().length < 2) errors.fullName = 'Please enter your full name'
  if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address'
  if (values.phone.trim() && !isValidSaPhone(values.phone)) {
    errors.phone = 'Use a South African number, e.g. 082 123 4567'
  }
  if (values.password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match'
  if (!values.acceptTerms) errors.acceptTerms = 'Please accept the Terms and Privacy Policy'
  return errors
}

/** Turns Supabase auth errors into messages a customer understands. */
export function friendlyAuthError(message: string): string {
  const text = message.toLowerCase()
  if (text.includes('invalid login credentials')) return 'Incorrect email or password.'
  if (text.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.'
  if (text.includes('already registered') || text.includes('already been registered')) {
    return 'An account with this email already exists. Try logging in.'
  }
  if (text.includes('rate limit')) return 'Too many attempts. Please wait a minute and try again.'
  return 'Something went wrong. Please try again.'
}
