import { axiosPublic } from '../utils/axios'

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
    const response = await axiosPublic.post('/auth/login', userData)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}