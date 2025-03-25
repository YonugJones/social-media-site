// handles display logic, including UI updates
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistanceToNow } from 'date-fns'
import styles from '../styles/CommentCard.module.css'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const CommentCard = ({ comment, onEdit, onDelete, onLikeToggle }) => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(comment.isLiked) 
  const [likeCount, setLikeCount] = useState(comment._count.likes || 0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const [isHovered, setIsHovered] = useState(false)

  const handleLikeClick = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    onLikeToggle(comment.postId, comment.id)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    onEdit(comment.postId, comment.id, editedContent)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedContent(comment.content)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(comment.postId, comment.id)
    navigate(`/posts/${comment.postId}`)
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