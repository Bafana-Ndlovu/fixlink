import { cn } from '../lib/cn'

type StatCardProps = {
  label: string
  value: number | string
  tone?: 'primary' | 'warning' | 'success' | 'accent'
}

const tones = {
  primary: 'bg-primary/10 text-primary',
  warning: 'bg-warning/15 text-amber-700',
  success: 'bg-success/15 text-success',
  accent: 'bg-accent-light text-accent',
}

export default function StatCard({ label, value, tone = 'primary' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={cn('mt-3 inline-block rounded-lg px-2.5 py-1 font-heading text-2xl font-semibold', tones[tone])}>
        {value}
      </p>
    </div>
  )
}
