import { axiosPublic } from '../utils/axios'
import { axiosPrivate } from '../utils/axios'

export const signupUser = async (userData) => {
  try {
    const response = await axiosPublic.post('/auth/signup', userData)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const loginUser = async (userData) => {
  try {
    const response = await axiosPublic.post('/auth/login', userData, { withCredentials: true })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const logoutUser = async () => {
  try {
    const response = await axiosPrivate.post('/auth/logout')
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}