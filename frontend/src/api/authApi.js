export const signupUser = async (axiosInstance, userData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
};