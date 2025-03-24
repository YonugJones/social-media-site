// custom hook for fetching post data
import usePost from './usePost'
import useAxiosPrivate from './useAxiosPrivate'
import { useCallback } from 'react'
import { handleApiError } from '../api/apiHelper'

const usePostFetch = () => {
  const { setPosts, setPost } = usePost()
  const axiosPrivate = useAxiosPrivate()

  const getFeed = useCallback(async () => {
    try {
      const response = await axiosPrivate.get('/posts/feed')
      setPosts(response.data.data)
    } catch (err) {
      handleApiError(err)
      setPosts([]) 
    }
  }, [axiosPrivate, setPosts])

  const getPost = useCallback(async (postId) => {
    try {
      const response = await axiosPrivate.get(`/posts/${postId}`)
      setPost(response.data.data)
    } catch (err) {
      handleApiError(err)
      setPost(null)
    }
  }, [axiosPrivate, setPost])

  return { getFeed, getPost }
}

export default usePostFetch
