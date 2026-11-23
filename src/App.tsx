import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import ProviderProfile from './pages/ProviderProfile'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import UiKit from './pages/UiKit'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import CustomerDashboard from './pages/dashboard/CustomerDashboard'
import ProviderDashboard from './pages/dashboard/ProviderDashboard'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/providers/:id" element={<ProviderProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ui-kit" element={<UiKit />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Logged-in areas: each role only sees its own dashboard */}
      <Route
        element={
          <ProtectedRoute allow={['customer']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Route>
      <Route
        element={
          <ProtectedRoute allow={['provider']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/provider" element={<ProviderDashboard />} />
      </Route>
      <Route
        element={
          <ProtectedRoute allow={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}
