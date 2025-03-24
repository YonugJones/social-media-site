// custom hook for handling post actions
import usePost from './usePost'
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'
import useAuth from './useAuth'

const usePostActions = () => {
  const { setPosts } = usePost()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()

  const newPost = async (content) => {
    try {
      const response = await axiosPrivate.post('/posts', { content })
      setPosts((prev) => [response.data.data, ...prev])
      console.log('auth after newPost:', auth)
    } catch (err) {
      handleApiError(err)
    }
  }

  const toggleLike = async (postId) => {
    try {
      await axiosPrivate.post(`/posts/${postId}/like`)
    } catch (err) {
      handleApiError(err)
    }
  }

  const handleEdit = async (postId, content) => {
    try {
      const response = await axiosPrivate.put(`/posts/${postId}`, { content })
      setPosts((prev) =>
        prev.map((post) => post.id === postId ? response.data.data : post)
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