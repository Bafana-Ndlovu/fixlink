import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { dashboardPathFor, type Role } from '../lib/auth'
import Spinner from './Spinner'

type ProtectedRouteProps = {
  allow: Role[]
  children: ReactNode
}

// Only lets users with one of the allowed roles see the page.
// Logged-out users go to /login; users with another role go to their own dashboard.
export default function ProtectedRoute({ allow, children }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading your account" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  if (!profile) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl">We couldn't load your profile</h1>
        <p className="mt-3">Please refresh the page or log in again.</p>
      </div>
    )
  }

  if (!allow.includes(profile.role)) return <Navigate to={dashboardPathFor(profile.role)} replace />

  return children
}
