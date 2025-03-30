// custom hook for fetching friendship data
import useFriendship from './useFriendship'
import useAxiosPrivate from './useAxiosPrivate'
import { useCallback } from 'react'
import { handleApiError } from '../api/apiHelper'

const useFriendshipFetch = () => {
  const { setFollowers, setPendingFollowers, setFollowing, setPendingFollowing, setUsers } = useFriendship()
  const axiosPrivate = useAxiosPrivate()

  const fetchAllUsers = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}`)
      setUsers(response.data.data)
    } catch (err) {
      handleApiError(err)
      setUsers([])
    }
  }, [axiosPrivate, setUsers])

  const fetchFollowers = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}/followers`)
      setFollowers(response.data.data)
    } catch (err) {
      handleApiError(err)
      setFollowers([])
    }
  }, [axiosPrivate, setFollowers])

  const fetchPendingFollowers = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}/pending-followers`)
      setPendingFollowers(response.data.data)
    } catch (err) {
      handleApiError(err)
      setPendingFollowers([])
    }
  }, [axiosPrivate, setPendingFollowers])

  const fetchFollowing = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}/following`)
      setFollowing(response.data.data)
    } catch (err) {
      handleApiError(err)
      setFollowing([])
    }
  }, [axiosPrivate, setFollowing]) 

  const fetchPendingFollowing = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/friendship/${userId}/pending-following`)
      setPendingFollowing(response.data.data)
    } catch (err) {
      handleApiError(err)
      setPendingFollowing([])
    }
  }, [axiosPrivate, setPendingFollowing])

  return { fetchAllUsers, fetchFollowers, fetchFollowing, fetchPendingFollowers, fetchPendingFollowing }
}

export default useFriendshipFetch