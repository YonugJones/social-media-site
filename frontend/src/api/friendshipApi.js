export const followRequest = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.post(`/users/${userId}/follow`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const confirmFollowRequest = async (axiosPrivateInstance, followerId) => {
  try {
    const response = await axiosPrivateInstance.post('/users/follow/confirm', { followerId })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const rejectFollowRequest = async (axiosPrivateInstance, followerId) => {
  try {
    const response = await axiosPrivateInstance.delete('/users/follow/reject', {
      data: { followerId }
    })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const removeFollower = async (axiosPrivateInstance, followerId) => {
  try {
    const response = await axiosPrivateInstance.delete('/users/follow/remove', {
      data: { followerId }
    })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const unfollow = async (axiosPrivateInstance, followingId) => {
  try {
    const response = await axiosPrivateInstance.delete('/users/follow/unfollow', {
      data: { followingId }
    })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}