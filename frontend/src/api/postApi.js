export const getFeedPosts = async (axiosPrivateInstance) => {
  try {
    const response = await axiosPrivateInstance.get('/posts/feed')
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const getPostById = async (axiosPrivateInstance, postId) => {
  try {
    const response = await axiosPrivateInstance.get(`/posts/${postId}`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const newPost = async (axiosPrivateInstance, content) => {
  try {
    const response = await axiosPrivateInstance.post('/posts', { content })
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

export const editPost = async (axiosPrivateInstance, postId, content) => {
  try {
    const response = await axiosPrivateInstance.put(`/posts/${postId}`, { content })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const deletePost = async (axiosPrivateInstance, postId) => {
  try {
    const response = await axiosPrivateInstance.delete(`/posts/${postId}`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}