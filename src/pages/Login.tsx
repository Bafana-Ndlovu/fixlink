import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/useAuth'
import { dashboardPathFor, friendlyAuthError, validateLogin, type FieldErrors, type LoginValues } from '../lib/auth'
import { supabase } from '../lib/supabase'

export default function Login() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [values, setValues] = useState<LoginValues>({ email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Once logged in (or already logged in), go to the right dashboard.
  useEffect(() => {
    if (profile) navigate(from ?? dashboardPathFor(profile.role), { replace: true })
  }, [profile, from, navigate])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateLogin(values)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    })
    setSubmitting(false)
    if (error) setFormError(friendlyAuthError(error.message))
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your bookings.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            {formError}
          </p>
        )}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          error={errors.password}
        />
        <Button type="submit" variant="gradient" size="lg" fullWidth disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log In'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  )
}
