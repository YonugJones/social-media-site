export const toggleLikeComment = async (axiosPrivateInstance, postId, commentId) => {
  try {
    const response = await axiosPrivateInstance.post(`/posts/${postId}/comments/${commentId}/like`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}