import axiosPublic from '../utils/axiosPublic'

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

export const refreshAccessToken = async (axiosInstance, token) => {
  try {
    const response = await axiosInstance.post('/auth/refresh', token)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}