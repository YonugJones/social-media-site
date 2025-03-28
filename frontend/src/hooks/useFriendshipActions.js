// custom hook for performing API calls and returning the updated friendship to the calling component.
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'

const useFriendshipActions = () => {
  const axiosPrivate = useAxiosPrivate()

  const sendFollowRequest = async (userId) => {
    try {
      const response = await axiosPrivate.post(`/friendship/${userId}/follow`)
      return response.data.data
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const confirmFollowRequest = async (followerId) => {
    try {
      const response = await axiosPrivate.post('/friendship/confirm', { followerId })
      return response.data.data
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const rejectFollowRequest = async (followerId) => {
    try {
      await axiosPrivate.delete('/friendship/reject', {
        data: { followerId }
      })
      return followerId
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const removeFollower = async (followerId) => {
    try {
      await axiosPrivate.delete('/friendship/remove', {
        data: { followerId }
      })
      return followerId
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const unfollow = async (followingId) => {
    try {
      await axiosPrivate.delete('/friendship/unfollow', {
        data: { followingId }
      })
      return followingId
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  return { sendFollowRequest, confirmFollowRequest, rejectFollowRequest, removeFollower, unfollow }
}

export default useFriendshipActions