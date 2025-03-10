import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { toggleLikeComment, editComment, deleteComment } from '../api/commentApi'
import { formatDistanceToNow } from 'date-fns'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/CommentCard.module.css'

const CommentCard = ({ comment, onEdit, onDelete }) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()

  const [isLiked, setIsLiked] = useState(comment.isLiked) 
  const [likeCount, setLikeCount] = useState(comment._count.likes || 0)
  const [isHovered, setIsHovered] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)

  useEffect(() => {
    setIsLiked(comment.isLiked)
    setLikeCount(comment._count.likes)
  }, [comment])

  const handleLikeClick = async () => {
    const previousLikeState = isLiked
    const previousLikeCount = likeCount

    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

    try {
      await toggleLikeComment(axiosPrivate, comment.postId, comment.id) 
    } catch (err) {
      console.error('Error toggling like:', err)
      setIsLiked(previousLikeState)
      setLikeCount(previousLikeCount)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    try {
      const updatedComment = await editComment(axiosPrivate, comment.postId, comment.id, editedContent)
      onEdit(updatedComment.data)
      setIsEditing(false)
    } catch (err) {
      console.error('Error editing comment:', err)
    }
  }

  const handleCancelEdit = () => {
    setEditedContent(comment.content)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    try {
      await deleteComment(axiosPrivate, comment.postId, comment.id)
      onDelete(comment.id)
    } catch (err) {
      console.error('Error deleting comment:', err)
    }
  }

  return (
    <div className={styles['comment']}>

      <div className={styles['header']}>
        <div className={styles['header-left']}>
          <img 
            className={styles['profile-pic']} 
            src={comment.user.profilePic || '/default-profile.svg'} alt='profile' 
          />
          <h3 className={styles['username']}>{comment.user.username}</h3>
          <p className={styles['date']}>
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </p>
        </div>
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
      </div>
      
      <div className={styles['content']}>
        {isEditing ? (
          <textarea 
            className={styles['edit-textarea']}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <p>{comment.content}</p>
        )}
      </div>

      {auth.id === comment.user.id && (
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
  )
}

export default CommentCard