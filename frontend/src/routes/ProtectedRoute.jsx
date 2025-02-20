import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = () => {
  const { auth } = useAuth()

  // If auth.accessToken exists, let authenticated routes through
  // Otherwise, redirect to login page
  return auth?.accessToken ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute