type SpinnerProps = {
  label?: string
}

export default function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 text-sm text-slate-500">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  )
}
