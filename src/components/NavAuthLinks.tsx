import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { dashboardPathFor } from '../lib/auth'
import { cn } from '../lib/cn'

type NavAuthLinksProps = {
  mobile?: boolean
}

// Login / Sign Up when logged out; Dashboard / Log out when logged in.
export default function NavAuthLinks({ mobile = false }: NavAuthLinksProps) {
  const { profile, signOut } = useAuth()

  const secondary = mobile
    ? 'rounded-lg border border-primary px-4 py-2 text-center text-sm font-medium text-primary'
    : 'rounded-md px-3 py-2 text-sm font-medium text-primary-dark transition hover:text-primary'
  const primary = cn(
    'bg-brand-gradient rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90',
    mobile && 'text-center',
  )

  if (profile) {
    return (
      <>
        <button type="button" onClick={() => signOut()} className={secondary}>
          Log out
        </button>
        <Link to={dashboardPathFor(profile.role)} className={primary}>
          Dashboard
        </Link>
      </>
    )
  }

  return (
    <>
      <Link to="/login" className={secondary}>
        Login
      </Link>
      <Link to="/signup" className={primary}>
        Sign Up
      </Link>
    </>
  )
}
