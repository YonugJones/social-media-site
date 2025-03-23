// // ORIGINAL CODE WITHOUT POST CONTEXT AND HOOKS
// import { useState, useEffect } from 'react'
// import { getFeedPosts } from '../api/postApi'
// import useAxiosPrivate from '../hooks/useAxiosPrivate'
// import PostCard from '../components/PostCard'
// import NewPost from '../components/NewPost'
// import styles from '../styles/UserFeed.module.css'

// const UserFeed = () => {
//   const [posts, setPosts] = useState([])
//   const [error, setError] = useState(false)
//   const axiosPrivate = useAxiosPrivate()

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await getFeedPosts(axiosPrivate)
//         setPosts(response.data)
//       } catch (err) {
//         setError(err)
//       }
//     }

//     fetchPosts()
//   }, [axiosPrivate])

//   const handleNewPost = (newPost) => {
//     setPosts((prevPosts) => [newPost, ...prevPosts])
//   }

//   const handleToggleCommentForm = () => {
//     console.log('you clicked the comment icon!')
//   }

//   const handleEditPost = (updatedPost) => {
//     setPosts((prevPosts) => 
//       prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
//     )
//   }

//   const handleDeletePost = (deletedPostId) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedPostId))
//   }

//   return (
//     <div className={styles['user-feed']}>
//       <NewPost onPostAdded={handleNewPost} />

//       {error && <p>Error loading posts</p>}
//       <ul>
//         {posts.length > 0 ? (
//           posts.map((post) => (
//             <PostCard 
//               key={post.id} 
//               post={post} 
//               onToggleCommentForm={handleToggleCommentForm} 
//               onEdit={handleEditPost}
//               onDelete={handleDeletePost}
//             />
//           ))
//         ) : (
//           <p>No posts to display</p>
//         )}
//       </ul>
//     </div>
//   )
// }

// export default UserFeed