import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export type BadgeVariant =
  | 'verified'
  | 'pending'
  | 'accepted'
  | 'completed'
  | 'cancelled'
  | 'ai'
  | 'neutral'

type BadgeProps = {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  verified: 'bg-success/10 text-success',
  pending: 'bg-warning/15 text-amber-700',
  accepted: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
  ai: 'bg-accent-light text-accent',
  neutral: 'bg-slate-100 text-body',
}

export default function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {variant === 'verified' && <span aria-hidden="true">✓</span>}
      {children}
    </span>
  )
}
