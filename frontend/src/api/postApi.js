export const getFeedPosts = async (axiosPrivateInstance) => {
  try {
    const response = await axiosPrivateInstance.get('/posts/feed')
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}