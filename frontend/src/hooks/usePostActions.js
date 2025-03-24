// custom hook for performing API calls and returning the updated post(s) to the calling component.
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'

const usePostActions = () => {
  const axiosPrivate = useAxiosPrivate()

  const createPost = async (content) => {
    try {
      const response = await axiosPrivate.post('/posts', { content })
      return response.data.data
    } catch (err) {
      handleApiError(err)
    }
  }

  const editPost = async (postId, content) => {
    try {
      const response = await axiosPrivate.put(`/posts/${postId}`, { content })
      return response.data.data
    } catch (err) {
      handleApiError(err)
    }
  }

  const deletePost = async (postId) => {
    try {
      await axiosPrivate.delete(`/posts/${postId}`)
      return postId
    } catch (err) {
      handleApiError(err)
    }
  }

  const toggleLike = async (postId) => {
    try {
      const response = await axiosPrivate.post(`/posts/${postId}/like`)
      return response.data.data
    } catch (err) {
      handleApiError(err)
    }
  }

  return { createPost, editPost, deletePost, toggleLike }
}

export default usePostActions