// fetches user profile and user posts and handles user and posts state management and displays ProfileCard and PostList
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useUser from '../hooks/useUser'
import useUserFetch from '../hooks/useUserFetch'
import useUserActions from '../hooks/useUserActions'
import usePost from '../hooks/usePost'
import usePostActions from '../hooks/usePostActions'
import ProfileCard from '../components/ProfileCard'
import PostList from '../components/PostList'
import styles from '../styles/Profile.module.css'

const Profile = () => {
  const { userId } = useParams()
  const { user, setUser } = useUser()
  const { getUserProfile, getUserPosts } = useUserFetch()
  const { editUserProfile, deleteUserProfile } = useUserActions()
  const { posts, setPosts } = usePost()
  const { editPost, deletePost, toggleLike } = usePostActions() 

  useEffect(() => {
    getUserProfile(userId)
    return () => setUser()
  }, [getUserProfile, userId, setUser])

  const handleEditUser = async (userId, content) => {
    const updatedUser = await editUserProfile(userId, content)
    setUser(updatedUser)
  }

  const handleDeleteUser = async (userId) => {
    await deleteUserProfile(userId)
    setUser(null)
  }

  useEffect(() => {
    getUserPosts(userId)
    return () => setPosts([])
  }, [getUserPosts, userId, setPosts])

  const handleEditPost = async (postId, content) => {
    const updatedPost = await editPost(postId, content)
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updatedPost : post))
    )
  }

  const handleDeletePost = async (postId) => {
    await deletePost(postId)
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
  }

  const handleLikeToggle = async (postId) => {
    const updatedPost = await toggleLike(postId)
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updatedPost : post))
    )
  }

  return (
    <div className={styles['profile-container']}>
      {user ? (
        <>
          <ProfileCard 
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
          {posts ? (
            <PostList 
              posts={posts}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onLikeToggle={handleLikeToggle}
            />
            ) : (
              <p>This user has no posts.</p>
          )}
        </>
      ) : (
        <p>Profile not found</p>
      )}
    </div>
  )
}

export default Profile


// import { useState, useEffect } from 'react'
// import { getUser, getPostsByUser, editUser } from '../api/userApi'
// import { 
//   getFollowers, 
//   getFollowing, 
//   sendFollowRequest, 
//   confirmFollowRequest, 
//   rejectFollowRequest, 
//   removeFollower, 
//   unfollow 

// } from '../api/friendshipApi'
// import useAuth from '../hooks/useAuth'
// import PostCard from '../components/PostCard'
// import Followers from '../components/Followers'
// import Following from '../components/Following'
// import useAxiosPrivate from '../hooks/useAxiosPrivate'
// import { useParams } from 'react-router-dom'
// import styles from '../styles/Profile.module.css'

// const Profile = () => {
//   const { userId } = useParams()
//   const { auth } = useAuth()
//   const axiosPrivate = useAxiosPrivate()
//   const [profile, setProfile] = useState({})
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const [isEditingProfile, setisEditingProfile] = useState(false)
//   const [formData, setFormData] = useState({
//     username: profile.username || '',
//     email: profile.email || '',
//     bio: profile.bio || '',
//     profilePic: profile.profilePic || ''
//   })

//   const [followers, setFollowers] = useState([])
//   const [following, setFollowing] = useState([])
//   const [showFollowers, setShowFollowers] = useState(false)
//   const [showFollowing, setShowFollowing] = useState(false)

//   useEffect(() => {
//     const fetchProfileAndPosts = async () => {
//       setLoading(true)
//       try {
//         const [userResponse, postsResponse] = await Promise.all([
//           getUser(axiosPrivate, userId),
//           getPostsByUser(axiosPrivate, userId)
//         ])

//         setProfile(userResponse.data)
//         setPosts(postsResponse.data)
//       } catch (err) {
//         setError(err.response?.data.message || 'Failed to retrieve profile and posts')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfileAndPosts()
//   }, [axiosPrivate, userId])

//   useEffect(() => {
//     setFormData({
//       username: profile.username || '',
//       email: profile.email || '',
//       bio: profile.bio || '',
//       profilePic: profile.profilePic || ''
//     })
//   }, [profile])

//   useEffect(() => {
//     const fetchFollowData = async () => {
//       try {
//         const [followersData, followingData] = await Promise.all([
//           getFollowers(axiosPrivate, userId),
//           getFollowing(axiosPrivate, userId)
//         ])
//         setFollowers(followersData.data)
//         setFollowing(followingData.data)
//       } catch (err) {
//         setError(err.response?.data.message || 'Failed to retrieve followers/following')
//       }
//     }

//     fetchFollowData()
//   }, [axiosPrivate, userId])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleEditClick = () => {
//     setisEditingProfile(true)
//   }

//   const handleCancelEdit = () => {
//     setisEditingProfile(false)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     try {
//       await editUser(axiosPrivate, userId, formData)
//       const userResponse = await getUser(axiosPrivate, userId)
//       setProfile(userResponse.data)
//       setisEditingProfile(false)
//     } catch (err) {
//       setError(err.response?.data.message || 'Failed to update profile')
//     }
//   }

//   const handleShowFollowers = async () => {
//     if (!showFollowers) {
//       try {
//         const followersData = await getFollowers(axiosPrivate, userId)
//         setFollowers(followersData.data)
//       } catch (err) {
//         setError(err.response?.data.message || 'Failed to retrieve followers')
//       }
//     }

//     setShowFollowers((prev) => !prev)
//     setShowFollowing(false)
//   }

//   const handleShowFollowing = async () => {
//     if (!showFollowing) {
//       try {
//         const followingData = await getFollowing(axiosPrivate, userId)
//         setFollowing(followingData.data)
//       } catch (err) {
//         setError(err.response?.data.message || 'Failed to retreive following')
//       }
//     }

//     setShowFollowing((prev) => !prev)
//     setShowFollowers(false)
//   }

//   const handleFollowAction = async (action, targetUserId) => {
//     try {
//       switch (action) {
//         case 'confirm':
//           await confirmFollowRequest(axiosPrivate, targetUserId)
//           break
  
//         case 'reject':
//           await rejectFollowRequest(axiosPrivate, targetUserId)
//           break
  
//         case 'remove':
//           await removeFollower(axiosPrivate, targetUserId)
//           break
          
//         case 'unfollow':
//           await unfollow(axiosPrivate, targetUserId)
//           break
  
//         case 'followBack':
//           await sendFollowRequest(axiosPrivate, targetUserId)
//           break
  
//         default:
//           console.warn('Unknown action:', action)
//       }
  
//       const [updatedFollowers, updatedFollowing] = await Promise.all([
//         getFollowers(axiosPrivate, userId),
//         getFollowing(axiosPrivate, userId)  
//       ])
  
//       setFollowers(updatedFollowers.data)
//       setFollowing(updatedFollowing.data)
  
//     } catch (err) {
//       console.error('Error handling follow action:', err)
//     }
//   }

//   return (
//     <>
//       {isEditingProfile ? (
//         <form onSubmit={handleSubmit} className={styles['edit-form']}>
//           <label>
//             Username:
//             <input type="text" name="username" value={formData.username} onChange={handleChange} />
//           </label>
//           <label>
//             Email:
//             <input type="email" name="email" value={formData.email} onChange={handleChange} />
//           </label>
//           <label>
//             Bio:
//             <textarea name="bio" value={formData.bio} onChange={handleChange} />
//           </label>
//           <label>
//             Profile Picture URL:
//             <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} />
//           </label>
//           <button type="submit">Save</button>
//           <button type="button" onClick={handleCancelEdit}>Cancel</button>
//         </form>
//       ) : (
//         <div className={styles['profile-container']}>
//           {loading && <p>Loading profile...</p>}
//           {error && <p>{error}</p>}

//           <div className={styles['profile-header']}>

//             <div className={styles['profile-pic']}>
//               <img src={profile.profilePic || '/default-profile.svg'} alt='profile' />
//             </div>

//             <div className={styles['profile-info']}>

//               <div className={styles['username-and-email-container']}>
//                 <p className={styles['username']}>{profile.username}</p>
//                 <p className={styles['email']}>{profile.email}</p>
//               </div>

//               <div className={styles['profile-sub-info']}>

//                 <div className={styles['posts-container']}>
//                   <p>{profile?._count?.posts ?? 0}</p>
//                   <p>posts</p>
//                 </div>

//                 <div className={styles['followers-container']}>
//                   <p>{profile?._count?.followers ?? 0}</p> 
                  
//                   <button onClick={handleShowFollowers} className={styles['toggle-button']}>
//                     followers
//                   </button>
//                 </div>

//                 <div className={styles['following-container']}>
//                   <p>{profile?._count?.following ?? 0}</p>
//                   <button onClick={handleShowFollowing} className={styles['toggle-button']}>
//                     following
//                   </button>
//                 </div>

//               </div>

//             </div>

//           </div>

//           <div className={styles['profile-bio']}>
//             <p>{profile.bio}</p>
//           </div>

//           {auth.id === Number(userId) && (
//             <button 
//               className={styles['edit-button']}
//               onClick={handleEditClick}
//             >
//               Edit Profile
//             </button>
//           )}

//         </div>
//       )}

//       {showFollowers && (
//         <Followers 
//           followers={followers} 
//           following={following}
//           onClose={handleShowFollowers} 
//           onAction={handleFollowAction} 
//           profileOwnerId={profile.id}
//         />
//       )}

//       {showFollowing && (
//         <Following 
//           following={following} 
//           onClose={handleShowFollowing} 
//           onAction={handleFollowAction} 
//           profileOwnerId={profile.id}
//         />
//       )}

//       <div className={styles['profile-posts']}>
//         <h2>{profile.username}&apos;s Posts</h2>
//         {posts.length > 0 ? (
//           posts.map((post) => (
//             <PostCard 
//               key={post.id} 
//               post={post} 
//               onToggleCommentForm={() => console.log('Comment icon clicked')} 
//             />
//           ))
//         ) : (
//           <p>No posts to display</p>
//         )}
//       </div>
      
//     </>

//   )
// }

// export default Profile