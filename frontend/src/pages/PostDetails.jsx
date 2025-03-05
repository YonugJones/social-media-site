import { useParams } from 'react-router-dom'
import usePost from '../hooks/usePost'
import PostCard from '../components/PostCard'
import CommentCard from '../components/CommentCard'
import styles from '../styles/PostDetails.module.css'

const PostDetails = () => {
  const { postId } = useParams()
  const { post, error } = usePost(postId)

  if (error) return <p>Error loading post</p>
  if (!post) return <p>Loading...</p>

  return (
    <div className={styles['post-details']}>
      <PostCard post={post} />

      <div className={styles['comments-section']}>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  )
}

export default PostDetails

// OLD CODE
// import PropTypes from 'prop-types'
// import styles from '../styles/PostDetails.module.css'

// const PostDetails = ({ post }) => {
//   return (
//     
//   )
// }

// PostDetails.propTypes = {
//   post: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     content: PropTypes.string.isRequired,
//     createdAt: PropTypes.string.isRequired,
//     user: PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       username: PropTypes.string.isRequired,
//       profilePic: PropTypes.string
//     }).isRequired,
//     likes: PropTypes.arrayOf(PropTypes.object).isRequired,
//     comments: PropTypes.arrayOf(
//       PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         postId: PropTypes.number.isRequired,
//         content: PropTypes.string.isRequired,
//         createdAt: PropTypes.string.isRequired,
//         user: PropTypes.shape({
//           id: PropTypes.number.isRequired,
//           username: PropTypes.string.isRequired,
//           profilePic: PropTypes.string
//         }).isRequired
//       })
//     ).isRequired
//   }).isRequired
// }

// export default PostDetails