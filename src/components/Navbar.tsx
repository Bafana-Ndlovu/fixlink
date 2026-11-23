import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../lib/cn'
import Logo from './Logo'
import NavAuthLinks from './NavAuthLinks'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Browse Services', to: '/browse' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'About Us', to: '/#about' },
]

const linkClass = 'rounded-md px-3 py-2 text-sm font-medium transition hover:text-primary'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)

  // Only highlight Home when there is no #section in the URL
  const isActive = (to: string) => {
    if (to.includes('#')) return location.pathname === '/' && `/${location.hash}` === to
    if (to === '/') return location.pathname === '/' && !location.hash
    return location.pathname.startsWith(to)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={cn(linkClass, isActive(link.to) ? 'text-primary' : 'text-body')}
                aria-current={isActive(link.to) ? 'page' : undefined}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <NavAuthLinks />
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-primary-dark md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden"
          onClick={(event) => {
            // Close the menu when any link inside it is tapped
            if ((event.target as HTMLElement).closest('a')) closeMenu()
          }}
        >
          <ul className="flex flex-col py-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={cn('block', linkClass, isActive(link.to) ? 'text-primary' : 'text-body')}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2">
            <NavAuthLinks mobile />
          </div>
        </div>
      )}
    </header>
  )
}
