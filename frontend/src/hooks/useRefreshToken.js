import { useAuth } from './useAuth'
import axiosPublic from '../utils/axiosPublic'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    try {
      const response = await axiosPublic.post('/auth/refresh', {}, { withCredentials: true })
      setAuth(prev => ({
        ...prev,
        accessToken: response.data.accessToken
      }))
      return response.data.accessToken
    } catch (err) {
      console.error('Failed to refresh access token:', err)
      throw err
    }
  }
  return refresh
}

export default useRefreshToken