import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean
}

export default function Card({ padded = true, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-sm',
        padded && 'p-6',
        className,
      )}
      {...props}
    />
  )
}
