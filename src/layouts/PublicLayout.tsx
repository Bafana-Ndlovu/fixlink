import { Outlet } from 'react-router-dom'

// Wraps every public page. Navbar and Footer are added in Issue #4.
export default function PublicLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
