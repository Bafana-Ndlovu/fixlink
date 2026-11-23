type PlaceholderProps = {
  title: string
  issue: number
}

// Temporary page body until the real page is built in its own Issue.
export default function Placeholder({ title, issue }: PlaceholderProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg">Coming soon — built in Issue #{issue}.</p>
      <span className="bg-brand-gradient mt-8 inline-block rounded-full px-6 py-3 font-medium text-white">
        FixLink design system
      </span>
    </section>
  )
}
