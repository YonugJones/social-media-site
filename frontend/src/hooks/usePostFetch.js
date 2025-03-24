// custom hook for fetching post data
import usePost from './usePost'
import useAxiosPrivate from './useAxiosPrivate'
import { useCallback } from 'react'
import { handleApiError } from '../api/apiHelper'

const usePostFetch = () => {
  const { setPosts } = usePost()
  const axiosPrivate = useAxiosPrivate()

  const getFeed = useCallback(async () => {
    try {
      const response = await axiosPrivate.get('/posts/feed')
      setPosts(response.data.data)
    } catch (err) {
      handleApiError(err)
    }
  }, [axiosPrivate, setPosts])

  const getPost = useCallback(async (postId) => {
    try {
      const response = await axiosPrivate.get(`/posts/${postId}`)
      setPosts([response.data.data])
    } catch (err) {
      handleApiError(err)
      setPosts([])
    }
  }, [axiosPrivate, setPosts])

  return { getFeed, getPost }
}

export default usePostFetch
