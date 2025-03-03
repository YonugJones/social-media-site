// import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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