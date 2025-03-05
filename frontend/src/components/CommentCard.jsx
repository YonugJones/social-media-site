import { faHeart, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/CommentCard.module.css'

const CommentCard = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked) // need to add isLiked to getPostById function in postController
  const [likeCount, setLikeCount] = useState(comment._count.likes)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={styles['comment']}>
      <div className={styles['header']}>
        <div className={styles['header-user']}>
          <img src={comment.user.profilePic || '/default-profile.svg'} alt='profile' />
          <h3>{comment.user.username}</h3>
        </div>
        <p className={styles['header-date']}>{new Date(comment.createdAt).toLocaleDateString()}</p>
      </div>
      <div className={styles['content']}>
        <p>{comment.content}</p>
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
      </div>
    </div>
  )
}

export default CommentCard