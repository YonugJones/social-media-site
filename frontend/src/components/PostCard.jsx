
import { faComment, faHeart, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/PostCard.module.css'

const PostCard = ({ post }) => {
  return (
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
        <button className={styles['likes-container']} onClick={() => console.log('like clicked!')}>
          <div className={styles['likes-img']}>
            <FontAwesomeIcon className={styles['fa-icon']} icon={faHeart} /> 
          </div>
          <div className={styles['likes-count']}>
            <p>{post._count.likes}</p>
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
  )
}

export default PostCard