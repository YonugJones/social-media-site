export const getUser = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/users/${userId}`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const getPostsByUser = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/users/${userId}/posts`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const editUser = async (axiosPrivateInstance, userId, userData) => {
  try {
    const response = await axiosPrivateInstance.put(`/users/${userId}`, userData)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const getFollowers = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/users/${userId}/followers`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const getFollowing = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/users/${userId}/following`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}

export const getNonFollowing = async (axiosPrivateInstance, userId) => {
  try {
    const response = await axiosPrivateInstance.get(`/users/${userId}/nonfollowing`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}