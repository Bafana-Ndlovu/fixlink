import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
}

export default function Input({ label, error, hint, id, className, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-primary-dark">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-body placeholder:text-slate-400',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-danger focus:ring-danger/30'
            : 'border-slate-300 focus:border-primary focus:ring-primary/30',
          className,
        )}
        {...props}
      />
      {message && (
        <p id={messageId} className={cn('text-xs', error ? 'text-danger' : 'text-slate-500')}>
          {message}
        </p>
      )}
    </div>
  )
}
