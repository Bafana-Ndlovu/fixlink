import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to the top on a new page, or to the #section in the URL (e.g. /#how-it-works)
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
