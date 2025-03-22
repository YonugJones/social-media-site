import { getFeedPosts, getPostById } from '../api/postApi'
import usePost from './usePost'

const usePostFetch = () => {
  const { setPosts } = usePost()

  const getFeed = async (axiosPrivate) => {
    try {
      const fetchPosts = await getFeedPosts(axiosPrivate)
      setPosts(fetchPosts.data)
    } catch (err) {
      console.error('Error getting user feed posts:', err)
    }
  }

  const getPost = async (axiosPrivate, postId) => {
    try {
      const fetchPost = await getPostById(axiosPrivate, postId)
      setPosts([fetchPost.data])
    } catch (err) {
      console.error('Error getting single post:', err)
    }
  }

  return { getFeed, getPost }
}

export default usePostFetch
