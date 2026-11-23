import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

type LogoProps = {
  light?: boolean
  className?: string
}

export default function Logo({ light = false, className }: LogoProps) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2', className)} aria-label="FixLink home">
      <span className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5" aria-hidden="true">
          <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" strokeLinecap="round" />
          <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" strokeLinecap="round" />
        </svg>
      </span>
      <span className={cn('font-heading text-xl font-bold', light ? 'text-white' : 'text-primary-dark')}>
        Fix<span className={light ? 'text-white' : 'text-primary'}>Link</span>
      </span>
    </Link>
  )
}
