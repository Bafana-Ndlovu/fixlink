import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/useAuth'
import type { Role } from '../lib/auth'
import { cn } from '../lib/cn'

const navByRole: Record<Role, Array<{ label: string; to: string }>> = {
  customer: [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Find Services', to: '/browse' },
  ],
  provider: [
    { label: 'Dashboard', to: '/provider' },
    { label: 'Browse Marketplace', to: '/browse' },
  ],
  admin: [
    { label: 'Overview', to: '/admin' },
    { label: 'Marketplace', to: '/browse' },
  ],
}

const roleLabel: Record<Role, string> = {
  customer: 'Customer',
  provider: 'Provider',
  admin: 'Admin',
}

// Sidebar layout shared by the customer, provider and admin dashboards.
export default function DashboardLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  if (!profile) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface md:flex-row">
      <aside className="flex flex-col border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <Logo />
          <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent md:mt-3 md:inline-block">
            {roleLabel[profile.role]}
          </span>
        </div>
        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
          {navByRole[profile.role].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition',
                  isActive ? 'bg-accent-light text-primary' : 'text-body hover:bg-slate-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-slate-200 p-4 md:block">
          <p className="truncate text-sm font-medium text-primary-dark">{profile.fullName || 'FixLink user'}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 text-sm font-medium text-danger hover:underline"
          >
            Log out
          </button>
        </div>
      </aside>

      <main id="main" className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-4 flex justify-end md:hidden">
          <button type="button" onClick={handleSignOut} className="text-sm font-medium text-danger">
            Log out
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
