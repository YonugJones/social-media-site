import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = () => {
  const { auth } = useAuth()

  console.log('auth:', auth) // logs {} after the user creates the comment

  return auth?.accessToken ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute