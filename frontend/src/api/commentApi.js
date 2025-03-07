export const newComment = async (axiosPrivateInstance, postId, content) => {
  try {
    const response = await axiosPrivateInstance.post(`/posts/${postId}/comments`, { content })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const deleteComment = async (axiosPrivateInstance, postId, commentId) => {
  try {
    const response = await axiosPrivateInstance.delete(`/posts/${postId}/comment/${commentId}`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const toggleLikeComment = async (axiosPrivateInstance, postId, commentId) => {
  try {
    const response = await axiosPrivateInstance.post(`/posts/${postId}/comments/${commentId}/like`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

// add editComment
