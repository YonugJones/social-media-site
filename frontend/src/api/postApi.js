export const getFeedPosts = async (axiosPrivateInstance) => {
  try {
    const response = await axiosPrivateInstance.get('/posts/feed')
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const toggleLikePost = async (axiosPrivateInstance, postId) => {
  try {
    const response = await axiosPrivateInstance.post(`/posts/${postId}/like`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}