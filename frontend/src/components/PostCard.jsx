// should display the post without comments and allow user to like and author to edit/delete
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatDistanceToNow } from 'date-fns'
import styles from '../styles/PostCard.module.css'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import usePostActions from '../hooks/usePostActions'
import { useNavigate } from 'react-router-dom'

const PostCard = ({ post }) => {
  const { auth } = useAuth()
  const { toggleLike, handleEdit, handleDelete } = usePostActions()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post._count.likes || 0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  const [isHovered, setIsHovered] = useState(false)

  const handleCardClick = () => {
    navigate(`/posts/${post.id}`)
  }

  const handleUsernameClick = (e) => {
    e.stopPropagation()
    navigate(`/profile/${post.userId}`)
  }

  const handleLikeClick = async (e) => {
    e.stopPropagation()
    console.log('Like clicked')
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    await toggleLike(post.id)
  }

  const handleEditClick = async (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSaveEdit = async (e) => {
    e.stopPropagation()
    await handleEdit(post.id, editedContent)
    setIsEditing(false)
  }

  const handleCancelEdit = async (e) => {
    e.stopPropagation()
    setEditedContent(post.content)
    setIsEditing(false)
  }

  const handleDeleteClick = async (e) => {
    e.stopPropagation()
    await handleDelete(post.id)
    navigate('/')
  }

  return (
    <div className={styles['post']} onClick={handleCardClick}>
      <div className={styles['header']}>

        <div className={styles['header-info']}>
          <div className={styles['header-user']}>
            <img src={post.user.profilePic || '/default-profile.svg'} alt='profile' />
            <button className={styles['header-user-button']} onClick={handleUsernameClick}>
              {post.user.username || 'Unknown user'}
            </button>
          </div>
          <p className={styles['date']}>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
        </div>
        
          <div className={styles['button-container']}>
            {auth.id === post.user.id && isEditing ? (
              <>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : auth.id === post.user.id ? (
              <>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
              </>
            ) : null}
          </div>

      </div>

      <div className={styles['content']}>
        {isEditing ? (
          <textarea 
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setEditedContent(e.target.value)}
            value={editedContent}
            className={styles['edit-textarea']}
          />
        ) : (
          <p>{post.content}</p>
        )}
      </div>

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

        <button className={styles['comments-container']}>
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