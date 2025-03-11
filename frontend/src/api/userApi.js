export const getUser = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/users/${userId}`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}