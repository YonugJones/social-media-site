import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/PostCard.module.css'

const PostCard = ({ post }) => {
  return (
    <div className={styles['post']}>
      <div className={styles['header']}>
        <img src={post.user.profilePic || '/default-profile.svg'} alt='profile' />
        <h3>{post.user.username}</h3>
        <p>{new Date(post.createdAt).toLocaleString()}</p>
      </div>
      <div className={styles['content']}>
        <p>{post.content}</p>
      </div>
      <div className={styles['footer']}>
        <div className={styles['likes-container']}>
          <div className={styles['likes-img']}>
            <FontAwesomeIcon icon={faHeart} /> 
          </div>
          <div className={styles['likes-count']}>
            <p>{post.likes.length}</p>
          </div>
        </div>
        <div className={styles['comments-container']}>
          <div className={styles['comments-img']}>
            <FontAwesomeIcon icon={faComment} />
          </div>
          <div className={styles['comments-count']}>
            <p>{post.comments.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard