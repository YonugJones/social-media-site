import { useState, useEffect } from 'react'
import { getUser, getPostsByUser } from '../api/userApi'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useParams } from 'react-router-dom'
import styles from '../styles/Profile.module.css'

const Profile = () => {
  // const [success, setSuccess] = useState(false)
  let { userId } = useParams()
  userId = Number(userId)
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [profile, setProfile] = useState({})
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  console.log(userId === auth.id) // logs true

  // immeidately fetch user profile and posts on mount
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true)
      try {
        const [userResponse, postsResponse] = await Promise.all([
          getUser(axiosPrivate, userId),
          getPostsByUser(axiosPrivate, userId)
        ])

        setProfile(userResponse.data)
        setPosts(postsResponse.data)
      } catch (err) {
        setError(err.response?.data.message || 'Failed to retrieve profile and posts')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndPosts()
  }, [axiosPrivate, userId])

  return (
    <div className={styles['profile-container']}>
      {loading && <p>Loading profile...</p>}
      {error && <p>{error}</p>}

      <div className={styles['profile-header']}>

        <div className={styles['profile-pic']}>
          <img src={profile.profilePic || '/default-profile.svg'} alt='profile' />
        </div>
        <div className={styles['profile-info']}>
          <div className={styles['username']}>
            {profile.username}
          </div>
          <div className={styles['profile-sub-info']}>
          <div className={styles['posts-container']}>
            <p>{profile?._count?.posts ?? 0}</p>
            <p>posts</p>
          </div>
          <div className={styles['followers-container']}>
            <p>{profile?._count?.followers ?? 0}</p>
            <p>followers</p>
          </div>
          <div className={styles['following-container']}>
            <p>{profile?._count?.following ?? 0}</p>
            <p>following</p>
          </div>
          </div>
        </div>
      </div>

      <div className={styles['profile-bio']}>
        <p>{profile.bio}</p>
      </div>

      {auth.id === userId && (
        <button className={styles['edit-button']}>Edit Profile</button>
      )}

      <div className={styles['profile-posts']}>
        <h2>{profile.username}&apos;s Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onToggleCommentForm={() => console.log('Comment icon clicked')} 
            />
          ))
        ) : (
          <p>No posts to display</p>
        )}
      </div>

   
      
    </div>
  )
}

export default Profile