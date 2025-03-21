import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPostById } from '../api/postApi'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PostCard from '../components/PostCard'
import CommentCard from '../components/CommentCard'
import NewComment from '../components/NewComment'
import styles from '../styles/PostDetails.module.css'

const PostDetails = () => {
  const { postId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [showCommentForm, setShowCommentForm] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(axiosPrivate, postId)
        setPost({ ...response.data, comments: response.data.comments || [] })
      } catch (err) {
        setError(err)
      }
    }

    fetchPost()
  }, [axiosPrivate, postId])

  const handleEditPost = (updatedPost) => {
    setPost(updatedPost)
  }

  const handleDeletePost = (deletedPostId) => {
    if (post.id === deletedPostId) {
      navigate('/')
    }
  }

  const handleNewComment = (newComment) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments ? [...prevPost.comments, newComment] : [newComment]
    }))
    setShowCommentForm(false)
  }

  const handleToggleCommentForm = () => {
    setShowCommentForm((prev) => !prev)
  }

  const handleEditComment = (editedComment) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.map((comment) =>
        comment.id === editedComment.id ? { ...comment, content: editedComment.content } : comment
      )
    }))
  }

  const handleDeleteComment = (deletedCommentId) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.filter((comment) => comment.id !== deletedCommentId)
    }))
  }

  if (error) return <p>Error loading post</p>
  if (!post) return <p>Loading...</p>

  return (
    <div className={styles['post-details']}>
      <PostCard 
        post={post} 
        onToggleCommentForm={handleToggleCommentForm} 
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />

      <div className={styles['comments-section']}>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
          <CommentCard 
            key={comment.id} 
            comment={comment} 
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />))
        ) : (
          <p>No comments yet</p>
        )}
        {showCommentForm && (
          <NewComment 
            postId={postId} 
            onCommentAdded={handleNewComment} 
          />
        )}
      </div>
    </div>
  )
}

export default PostDetails