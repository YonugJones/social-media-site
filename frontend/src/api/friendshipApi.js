export const followRequest = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.post(`/users/${userId}/follow`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

