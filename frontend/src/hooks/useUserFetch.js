// custom hook for fetching user data
import useUser from './useUser'
import usePost from './usePost'
import useAxiosPrivate from './useAxiosPrivate'
import { useCallback } from 'react'
import { handleApiError } from '../api/apiHelper'

const useUserFetch = () => {
  const { setUser } = useUser()
  const { setPosts } = usePost()
  const axiosPrivate = useAxiosPrivate()

  const getUserProfile = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/users/${userId}`)
      setUser(response.data.data)
    } catch (err) {
      handleApiError(err)
      setUser(null)
    }
  }, [axiosPrivate, setUser])

  const getUserPosts = useCallback(async (userId) => {
    try {
      const response = await axiosPrivate.get(`/users/${userId}/posts`)
      setPosts(response.data.data)
    } catch (err) {
      handleApiError(err)
      setPosts(null)
    }
  }, [axiosPrivate, setPosts])

  return { getUserProfile, getUserPosts }
} 

export default useUserFetch