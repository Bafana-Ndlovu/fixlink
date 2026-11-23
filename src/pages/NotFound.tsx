import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <Link to="/" className="mt-4 inline-block font-medium text-primary hover:underline">
        Back to home
      </Link>
    </section>
  )
}
