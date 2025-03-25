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
    }
  }

  return { createComment }
}

export default useCommentActions