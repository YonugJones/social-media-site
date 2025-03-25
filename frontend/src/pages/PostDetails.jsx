// fetches post, handles post state management, displays PostCard and CommentList components
import { useEffect } from 'react'
import usePost from '../hooks/usePost'
import usePostFetch from '../hooks/usePostFetch'
import usePostActions from '../hooks/usePostActions'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import styles from '../styles/PostDetails.module.css'

const PostDetails = () => {
  const { post, setPost } = usePost()
  const { getPost } = usePostFetch()
  const { editPost, deletePost, toggleLike } = usePostActions()
  const { postId } = useParams()

  // Immeiately fetch Post on mount, clear setPost on dismount
  useEffect(() => {
    getPost(postId)
    return () => setPost(null)
  }, [getPost, postId, setPost])

  // handlers for user actions
  const handleEditPost = async (postId, content) => {
    const updatedPost = await editPost(postId, content)
    setPost(updatedPost)
  }

  const handleDeletePost = async (postId) => {
    await deletePost(postId)
    setPost(null)
  }

  const handleLikeToggle = async (postId) => {
    const updatedPost = await toggleLike(postId)
    setPost(updatedPost)
  }

  return (
    <div className={styles['post-details']}>
      {post ? (
        <PostCard 
          post={post} 
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onLikeToggle={handleLikeToggle}
        />
      ) : (
        <p>loading posts...</p>
      )}
    </div>
  )
}

export default PostDetails