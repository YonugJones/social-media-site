// fetches post, handles post state management, displays PostCard and CommentList components
import { useEffect } from 'react'
import usePost from '../hooks/usePost'
import usePostFetch from '../hooks/usePostFetch'
import usePostActions from '../hooks/usePostActions'
import useCommentActions from '../hooks/useCommentActions'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import CommentList from '../components/CommentList'
import styles from '../styles/PostDetails.module.css'

const PostDetails = () => {
  const { post, setPost } = usePost()
  const { getPost } = usePostFetch()
  const { editPost, deletePost, toggleLike } = usePostActions()
  const { editComment, deleteComment, toggleCommentLike } = useCommentActions()
  const { postId } = useParams()

  // Immeiately fetch Post on mount, clear setPost on dismount
  useEffect(() => {
    getPost(postId)
    return () => setPost(null)
  }, [getPost, postId, setPost])

  // Post Handlers
  const handleEditPost = async (postId, content) => {
    const updatedPost = await editPost(postId, content)
    setPost(updatedPost)
  }

  const handleDeletePost = async (postId) => {
    await deletePost(postId)
    setPost(null)
  }

  const handleLikePostToggle = async (postId) => {
    const updatedPost = await toggleLike(postId)
    setPost(updatedPost)
  }

  // Comment Handlers
  const handleEditComment = async (postId, commentId, content) => {
    const updatedComment = await editComment(postId, commentId, content)
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost?.comments.map((comment) => comment.id === commentId ? updatedComment : comment)
    }))
  }

  const handleDeleteComment = async (postId, commentId) => {
    await deleteComment(postId, commentId)
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.filter((comment) => comment.id !== commentId)
    }))
  }

  const handleLikeCommentToggle = async (postId, commentId) => {
    const updatedComment = await toggleCommentLike(postId, commentId)
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.map((comment) => comment.id === commentId ? updatedComment : comment)
    }))
  }

  return (
    <div className={styles['post-details']}>
      {post ? (
        <>
          <PostCard 
            post={post} 
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onLikeToggle={handleLikePostToggle}
          />
          <CommentList 
            comments={post.comments}
            onEdit={handleEditComment} 
            onDelete={handleDeleteComment}
            onLikeToggle={handleLikeCommentToggle}
          />
        </>
      ) : (
        <p>loading posts...</p>
      )}
    </div>
  )
}

export default PostDetails