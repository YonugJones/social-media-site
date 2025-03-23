import { useEffect } from 'react'
import { axiosPrivate } from '../utils/axios'
import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken'

const useAxiosPrivate = () => {
  const { auth } = useAuth()
  const refresh = useRefreshToken()

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config
        if (error?.response?.status === 403 && !prevRequest._retry) {
          prevRequest._retry = true
          try {
            const newToken = await refresh()
            prevRequest.headers['Authorization'] = `Bearer ${newToken}`
            return axiosPrivate(prevRequest)
          } catch (err) {
            console.error('Token refresh failed', err)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor)
      axiosPrivate.interceptors.response.eject(responseInterceptor)
    }
    
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate