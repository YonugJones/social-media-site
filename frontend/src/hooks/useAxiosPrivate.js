// Takes the axiosPrivate instance and attached interceptors
// This allows cookies to be attached the Bearer token to be correctly set

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
        // this is not a retry, there has been no auth header set
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // potentially added a NEW accessToken to response auth header
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      // if accessToken is attached and not expired, return the response with no changes to interceptors
      (response) => response,
      // if accessToken has expired
      async (error) => {
        const prevRequest = error.config
        // forbidden error if accessToken has expired or this has only tried once
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
      // on unmount eject the attached auth headers so they don't pile up
      axiosPrivate.interceptors.request.eject(requestInterceptor)
      axiosPrivate.interceptors.response.eject(responseInterceptor)
    }
    
  }, [auth, refresh])

  // axiosPrivate instance returned with attached interceptors to req and res
  return axiosPrivate
}

export default useAxiosPrivate