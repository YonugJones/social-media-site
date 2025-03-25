// custom hook for performing API calls and returning the updated comment to the calling component
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'

const useCommentActions = () => {
  const axiosPrivate = useAxiosPrivate()

  const createComment = async (postId, content) => {
    try {
      const response = await axiosPrivate.post(`/posts/${postId}/comments`, { content })
      return response.data.data
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const editComment = async (postId, commentId, content) => {
    try {
      const response = await axiosPrivate.put(`/posts/${postId}/comments/${commentId}`, { content })
      return response.data.data
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const deleteComment = async (postId, commentId) => {
    try {
      await axiosPrivate.delete(`/posts/${postId}/comments/${commentId}`)
      return { postId, commentId }
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const toggleLike = async (postId, commentId) => {
    try {
      const response = await axiosPrivate.post(`/posts/${postId}/comments/${commentId}/like`)
      return response.data.data
    } catch (err) {
      handleApiError(err)
      return null
    }
  } 

  return { createComment, editComment, deleteComment, toggleLike }
}

export default useCommentActions