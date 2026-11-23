import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1>Page not found</h1>
      <Link to="/">Back to home</Link>
    </section>
  )
}
