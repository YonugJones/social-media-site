import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import styles from '../styles/PostDetails.module.css'

const PostDetails = ({ post }) => {
  return (
    <div className={styles['post']}>
      <div className={styles['post-header']}>
        <img className={styles['profile-pic']} src={post.user.profilePic || '/default-profile.svg'} alt='profile' />
        <h3>{post.user.username}</h3>
        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      <p>{post.content}</p>
      <div className={styles['post-footer']}>
        <span>
          <FontAwesomeIcon icon={faHeart} /> {post.likes.length}
        </span>
        <span>
          <FontAwesomeIcon icon={faComment} /> {post.comments.length}
        </span>
      </div>
    </div>
  )
}

PostDetails.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      profilePic: PropTypes.string
    }).isRequired,
    likes: PropTypes.arrayOf(PropTypes.object).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        postId: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        user: PropTypes.shape({
          id: PropTypes.number.isRequired,
          username: PropTypes.string.isRequired,
          profilePic: PropTypes.string
        }).isRequired
      })
    ).isRequired
  }).isRequired
}

export default PostDetails