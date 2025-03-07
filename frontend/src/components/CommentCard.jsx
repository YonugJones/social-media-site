import { useState, useEffect } from 'react'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAuth from '../hooks/useAuth'
import styles from '../styles/CommentCard.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { toggleLikeComment, deleteComment } from '../api/commentApi'
import { formatDistanceToNow } from 'date-fns'

const CommentCard = ({ comment }) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [isLiked, setIsLiked] = useState(comment.isLiked) 
  const [likeCount, setLikeCount] = useState(comment._count.likes)
  const [isHovered, setIsHovered] = useState(false)

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

  const handleDelete = async () => {
    try {
      const response = await deleteComment(axiosPrivate, comment.postId, comment.id)
      console.log(response)
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
      
      {/* CONTENT */}
      <div className={styles['content']}>
        <p>{comment.content}</p>
      </div>

      {auth.id === comment.user.id && (
        <div className={styles['button-container']}>
          <button>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default CommentCard