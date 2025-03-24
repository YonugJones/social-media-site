// custom hook for handling comment actions
import usePost from './usePost'
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'

const useCommentActions = () => {
  const { setPost } = usePost()
  const axiosPrivate = useAxiosPrivate()

  const newComment = async (postId, content) => {
    try {
      const response = await axiosPrivate.post(`/posts/${postId}/comments`, { content })
      const newComment = response.data.data
      setPost((prevPost) => ({
        ...prevPost,
        comments: [newComment, ...prevPost.comments]
      }))
    } catch (err) {
      handleApiError(err)
    }
  }

  return { newComment }
}

export default useCommentActions