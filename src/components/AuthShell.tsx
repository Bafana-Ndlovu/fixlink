import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

// Split layout for Login and Sign Up: brand panel on the left (desktop), form on the right.
export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-16">
      <div className="bg-brand-gradient hidden flex-col justify-between rounded-3xl p-10 text-white md:flex">
        <div>
          <p className="text-sm font-medium tracking-wide text-white/80 uppercase">FixLink</p>
          <h2 className="mt-4 text-3xl leading-tight text-white">Trusted local professionals, one click away.</h2>
        </div>
        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
          <p className="text-white/95">
            Every provider with a Verified badge is checked by our team, and reviews only come from completed bookings.
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-3 text-sm text-white/90">
          <li>Verified pros</li>
          <li>Real reviews</li>
          <li>Free quotes</li>
        </ul>
      </div>

      <div className="mx-auto w-full max-w-md self-center">
        <h1 className="text-3xl">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
