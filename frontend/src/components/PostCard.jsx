import { useState, useEffect } from 'react'
import { faComment, faHeart, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/PostCard.module.css'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { toggleLikePost } from '../api/postApi'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
  const axiosPrivate = useAxiosPrivate()
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setIsLiked(post.isLiked)
    setLikeCount(post._count.likes)
  }, [post])

  const handleLikeClick = async () => {
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

  return (
    <Link to={`/posts/${post.id}`} className={styles['post-link']}>
      <div className={styles['post']}>
        <div className={styles['header']}>
          <div className={styles['header-user']}>
            <img src={post.user.profilePic || '/default-profile.svg'} alt='profile' />
            <h3>{post.user.username}</h3>
          </div>
          <p className={styles['header-date']}>{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <div className={styles['content']}>
          <p>{post.content}</p>
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
          <button className={styles['repost-container']} onClick={() => console.log('repost clicked!')}>
            <div className={styles['repost-img']}>
              <FontAwesomeIcon className={styles['fa-icon']} icon={faRepeat} /> 
            </div>
            <div className={styles['repost-count']}>
              <p>TBD</p>
            </div>
          </button>
          <button className={styles['comments-container']} onClick={() => console.log('comment clicked')}>
            <div className={styles['comments-img']}>
              <FontAwesomeIcon className={styles['fa-icon']} icon={faComment} />
            </div>
            <div className={styles['comments-count']}>
              <p>{post._count.comments}</p>
            </div>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default PostCard