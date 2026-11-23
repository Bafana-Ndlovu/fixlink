import { Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import ProviderProfile from './pages/ProviderProfile'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import UiKit from './pages/UiKit'

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
    </Routes>
  )
}
