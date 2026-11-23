type PlaceholderProps = {
  title: string
  issue: number
}

// Temporary page body until the real page is built in its own Issue.
export default function Placeholder({ title, issue }: PlaceholderProps) {
  return (
    <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>Coming soon — built in Issue #{issue}.</p>
    </section>
  )
}
