import { newPost as newPostApi, toggleLikePost, editPost, deletePost } from '../api/postApi'
import usePost from './usePost'

const usePostActions = () => {
  const { setPosts } = usePost()

  const newPost = async (axiosPrivate, content) => {
    try {
      const newPostData = await newPostApi(axiosPrivate, content)
      setPosts((prev) => [newPostData.data, ...prev])
    } catch (err) {
      console.error('Error creating post:', err)  
    }
  }

  const toggleLike = async (axiosPrivate, postId) => {
    try {
      await toggleLikePost(axiosPrivate, postId)
    } catch (err) {
      console.error('Error toggling post like:', err) 
    }
  }

  const handleEdit = async (axiosPrivate, postId, content) => {
    try {
      const updatedPost = await editPost(axiosPrivate, postId, content)
      const updatedPostData = updatedPost.data
      setPosts((prev) =>
        prev.map((post) => (post.id === updatedPostData.id ? updatedPostData : post))
      )      
    } catch (err) {
      console.error('Error editing post:', err)
    }
  }

  const handleDelete = async (axiosPrivate, postId) => {
    try {
      await deletePost(axiosPrivate, postId)
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  return { newPost, toggleLike, handleEdit, handleDelete }
}

export default usePostActions