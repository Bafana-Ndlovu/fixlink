import { Link } from 'react-router-dom'
import Logo from './Logo'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'Services',
    links: [
      { label: 'Plumbing', to: '/browse?category=plumbing' },
      { label: 'Electrical', to: '/browse?category=electrical' },
      { label: 'Cleaning', to: '/browse?category=cleaning' },
      { label: 'Painting', to: '/browse?category=painting' },
      { label: 'Gardening', to: '/browse?category=gardening' },
      { label: 'Handyman', to: '/browse?category=handyman' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/#about' },
      { label: 'How It Works', to: '/#how-it-works' },
      { label: 'Browse Services', to: '/browse' },
    ],
  },
  {
    title: 'For Providers',
    links: [
      { label: 'Join as a Provider', to: '/signup?role=provider' },
      { label: 'Provider Login', to: '/login' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 md:col-span-3 lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Find trusted professionals. Get things fixed. Verified local service providers across South Africa.
          </p>
          <p className="mt-4 text-sm">
            <a href="mailto:hello@fixlink.co.za" className="hover:text-white">
              hello@fixlink.co.za
            </a>
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">{column.title}</h2>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:justify-between sm:px-6">
          <p>© {year} FixLink. All rights reserved.</p>
          <p>Made in South Africa 🇿🇦</p>
        </div>
      </div>
    </footer>
  )
}
