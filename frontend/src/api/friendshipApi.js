export const getFollowers = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/friendship/${userId}/followers`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const getFollowing = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/friendship/${userId}/following`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const getNonFollowing = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/friendship/${userId}/nonfollowing`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}     

export const sendFollowRequest = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.post(`/friendship/${userId}/follow`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const confirmFollowRequest = async (axiosPrivateInstance, followerId) => {
  try {
    const response = await axiosPrivateInstance.post('/friendship/follow/confirm', { followerId })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const rejectFollowRequest = async (axiosPrivateInstance, followerId) => {
  try {
    const response = await axiosPrivateInstance.delete('/friendship/follow/reject', {
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
    const response = await axiosPrivateInstance.delete('/friendship/follow/remove', {
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
    const response = await axiosPrivateInstance.delete('/friendship/follow/unfollow', {
      data: { followingId }
    })
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}