import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/useAuth'
import { dashboardPathFor, friendlyAuthError, validateSignUp, type FieldErrors, type SignUpValues } from '../lib/auth'
import { cn } from '../lib/cn'
import { supabase } from '../lib/supabase'

const accountTypes: Array<{ value: SignUpValues['role']; title: string; text: string }> = [
  { value: 'customer', title: 'I need a service', text: 'Find and book trusted pros' },
  { value: 'provider', title: 'I offer services', text: 'Get found by local customers' },
]

export default function SignUp() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [values, setValues] = useState<SignUpValues>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // /signup?role=provider pre-selects the provider account type
    role: params.get('role') === 'provider' ? 'provider' : 'customer',
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<FieldErrors<SignUpValues>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  useEffect(() => {
    if (profile) navigate(dashboardPathFor(profile.role), { replace: true })
  }, [profile, navigate])

  const update = <K extends keyof SignUpValues>(key: K, value: SignUpValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateSignUp(values)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const { data, error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        // Read by the database trigger that creates the profile (admin can never be chosen here).
        data: { full_name: values.fullName.trim(), phone: values.phone.trim() || null, role: values.role },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    setSubmitting(false)

    if (error) {
      setFormError(friendlyAuthError(error.message))
      return
    }
    // With email confirmation on, there is no session until the user clicks the email link.
    if (!data.session) setCheckEmail(true)
  }

  if (checkEmail) {
    return (
      <AuthShell title="Check your email" subtitle={`We sent a confirmation link to ${values.email}.`}>
        <p>Click the link in the email to activate your account, then log in.</p>
        <Link to="/login" className="mt-6 inline-block font-medium text-primary hover:underline">
          Go to login
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Create your account" subtitle="Join FixLink in less than a minute.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            {formError}
          </p>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-primary-dark">Account type</legend>
          <div className="grid grid-cols-2 gap-3">
            {accountTypes.map((type) => (
              <label
                key={type.value}
                className={cn(
                  'cursor-pointer rounded-xl border p-4 transition',
                  values.role === type.value
                    ? 'border-primary bg-accent-light'
                    : 'border-slate-300 bg-white hover:border-primary/50',
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={type.value}
                  checked={values.role === type.value}
                  onChange={() => update('role', type.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-primary-dark">{type.title}</span>
                <span className="mt-1 block text-xs text-slate-500">{type.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Input
          label="Full name"
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          error={errors.fullName}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="082 123 4567"
          value={values.phone}
          onChange={(e) => update('phone', e.target.value)}
          error={errors.phone}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          value={values.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />

        <div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.acceptTerms}
              onChange={(e) => update('acceptTerms', e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>I agree to the Terms and Conditions and Privacy Policy</span>
          </label>
          {errors.acceptTerms && <p className="mt-1 text-xs text-danger">{errors.acceptTerms}</p>}
        </div>

        <Button type="submit" variant="gradient" size="lg" fullWidth disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}
