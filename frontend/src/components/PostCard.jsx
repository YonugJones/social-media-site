import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { faComment, faHeart, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/PostCard.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { toggleLikePost, editPost, deletePost } from '../api/postApi'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

const PostCard = ({ post, onToggleCommentForm, onEdit, onDelete }) => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()

  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [isHovered, setIsHovered] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)

  useEffect(() => {
    setIsLiked(post.isLiked)
    setLikeCount(post._count.likes)
  }, [post])

  const handleLikeClick = async (e) => {
    e.stopPropagation()
    const previousLikeState = isLiked
    const previousLikeCount = likeCount

    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

    try {
      await toggleLikePost(axiosPrivate, post.id)
    } catch (err) {
      console.error('Error toggling like:', err)
      setIsLiked(previousLikeState)
      setLikeCount(previousLikeCount)
    }
  }

  const handleCardClick = () => {
    navigate(`/posts/${post.id}`)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    try {
      const response = await editPost(axiosPrivate, post.id, editedContent)
      onEdit(response.data)
      setIsEditing(false)
    } catch (err) {
      console.error('Error editing post:', err)
    }
  }

  const handleCancelEdit = () => {
    setEditedContent(post.content)
    setIsEditing(false)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()

    try {
      await deletePost(axiosPrivate, post.id)
      onDelete(post.id)
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  return (
    <div className={styles['post']} onClick={handleCardClick}>
      {/* TOP */}
      <div className={styles['header']}>

        <div className={styles['header-info']}>
          <div className={styles['header-user']}>
            <img src={post.user.profilePic || '/default-profile.svg'} alt='profile' />
            <h3>{post.user.username}</h3>
          </div>
          <p className={styles['date']}>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>

        {auth.id === post.user.id && (
          <div className={styles['button-container']}>
            {isEditing ? (
              <>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </>
            )}
          </div>
        )}

      </div>

      {/* MIDDLE */}
      <div className={styles['content']}>
        {isEditing ? (
          <textarea 
            className={styles['edit-textarea']}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <p>{post.content}</p>
        )}
      </div>

      {/* BOTTOM */}
      <div className={styles['footer']}>
        <button 
          className={`
            ${styles['likes-container']} 
            ${isLiked ? styles['liked'] : styles['unliked']} 
            ${isHovered && isLiked ? styles['unliked'] : ''}
          `} 
          onClick={handleLikeClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles['likes-img']}>
            <FontAwesomeIcon className={styles['fa-icon']} icon={faHeart} />
          </div>
          <div className={styles['likes-count']}>
            <p>{likeCount}</p>
          </div>
        </button>
        <button className={styles['repost-container']} onClick={() => console.log('repost clicked!')}>
          <div className={styles['repost-img']}>
            <FontAwesomeIcon className={styles['fa-icon']} icon={faRepeat} /> 
          </div>
          <div className={styles['repost-count']}>
            <p>TBD</p>
          </div>
        </button>
        <button className={styles['comments-container']} onClick={() => onToggleCommentForm(post.id)}>
          <div className={styles['comments-img']}>
            <FontAwesomeIcon className={styles['fa-icon']} icon={faComment} />
          </div>
          <div className={styles['comments-count']}>
            <p>{post._count.comments}</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default PostCard