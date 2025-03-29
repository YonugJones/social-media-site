// custom hook for fetching friendship data
import useFriendship from './useFriendship'
import useAxiosPrivate from './useAxiosPrivate'
import { useCallback } from 'react'
import { handleApiError } from '../api/apiHelper'

const useFriendshipFetch = () => {
  const { setFollowers, setPendingFollowers, setFollowing, setPendingFollowing } = useFriendship()
  const axiosPrivate = useAxiosPrivate()

  const fetchFriendshipData = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}`)
      setFollowers([response.data.data.followers])
      setPendingFollowers([response.data.data.setPendingFollowers])
      setFollowing([response.data.data.following])
      setPendingFollowing([response.data.data.pendingFollowing])
    } catch (err) {
      handleApiError(err)
      setFollowers([])
      setPendingFollowers([])
      setFollowing([])
      setPendingFollowing([])
    }
  }, [axiosPrivate, setFollowers, setFollowing, setPendingFollowers, setPendingFollowing])

  // const getFollowers = useCallback(async (userId) => {
  //   try {
  //     const response = await axiosPrivate.get(`/friendship/${userId}/followers`)
  //     setFollowers(response.data.data)
  //   } catch (err) {
  //     handleApiError(err)
  //     setFollowers([])
  //   }
  // }, [axiosPrivate, setFollowers])

  // const getFollowing = useCallback(async (userId) => {
  //   try {
  //     const response = await axiosPrivate.get(`/friendship/${userId}/following`)
  //     setFollowing(response.data.data)
  //   } catch (err) {
  //     handleApiError(err)
  //     setFollowing([])
  //   }
  // }, [axiosPrivate, setFollowing]) 

  return { fetchFriendshipData }
}

export default useFriendshipFetch