// custom hook for handling post actions
import usePost from './usePost'
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'

const usePostActions = () => {
  const { setPosts, setPost } = usePost()
  const axiosPrivate = useAxiosPrivate()

  const newPost = async (content) => {
    try {
      const response = await axiosPrivate.post('/posts', { content })
      const newPost = response.data.data
      setPosts((prevPosts) => [newPost, ...prevPosts])
    } catch (err) {
      handleApiError(err)
    }
  }

  const toggleLike = async (postId) => {
    try {
      const response = await axiosPrivate.post(`/posts/${postId}/like`)
      const updatedPost = response.data.data
      setPost((prevPost) => 
        prevPost.map((post) => post.id === postId ? updatedPost : post)
      )
    } catch (err) {
      handleApiError(err)
    }
  }

  const handleEdit = async (postId, content) => {
    try {
      const response = await axiosPrivate.put(`/posts/${postId}`, { content })
      const updatedPost = response.data.data
      setPosts((prev) =>
        prev.map((post) => post.id === postId ? updatedPost : post)
      )
    } catch (err) {
      handleApiError(err)
    }
  }

  const handleDelete = async (postId) => {
    try {
      await axiosPrivate.delete(`/posts/${postId}`)
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } catch (err) {
      handleApiError(err)
    }
  }

  return { newPost, toggleLike, handleEdit, handleDelete }
}

export default usePostActions