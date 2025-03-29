// custom hook for fetching friendship data
import useFriendship from './useFriendship'
import useAxiosPrivate from './useAxiosPrivate'
import { useCallback } from 'react'
import { handleApiError } from '../api/apiHelper'

const useFriendshipFetch = () => {
  const { setFollowers, setFollowing } = useFriendship()
  const axiosPrivate = useAxiosPrivate()

  const getFollowers = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}/followers`)
      setFollowers(response.data.data)
    } catch (err) {
      handleApiError(err)
      setFollowers([])
    }
  }, [axiosPrivate, setFollowers])

  const getFollowing = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}/following`)
      setFollowing(response.data.data)
    } catch (err) {
      handleApiError(err)
      setFollowing([])
    }
  }, [axiosPrivate, setFollowing])

  return { getFollowers, getFollowing }
}

export default useFriendshipFetch