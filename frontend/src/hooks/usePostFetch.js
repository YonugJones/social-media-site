import usePost from './usePost'
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'

const usePostFetch = () => {
  const { setPosts } = usePost()
  const axiosPrivate = useAxiosPrivate()

  const getFeed = async () => {
      try {
        const response = await axiosPrivate.get('/posts/feed')
        return response.data
      } catch (err) {
        handleApiError(err)
      }
  }

  const getPost = async (postId) => {
    try {
      const fetchPost = await axiosPrivate.get(`/posts/${postId}`)
      setPosts([fetchPost.data])
    } catch (err) {
      handleApiError(err)
      setPosts([])
    }
  }

  return { getFeed, getPost }
}

export default usePostFetch
