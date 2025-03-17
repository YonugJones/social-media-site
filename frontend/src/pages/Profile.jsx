import { useState, useEffect } from 'react'
import { getUser, getPostsByUser, editUser, getFollowers, getFollowing } from '../api/userApi'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'
import Followers from '../components/Followers'
import Following from '../components/Following'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useParams } from 'react-router-dom'
import styles from '../styles/Profile.module.css'

const Profile = () => {
  // const [success, setSuccess] = useState(false)
  const { userId } = useParams()
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [profile, setProfile] = useState({})
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: profile.username || '',
    email: profile.email || '',
    bio: profile.bio || '',
    profilePic: profile.profilePic || ''
  })

  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

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

  // update formData when profile data is fetched
  useEffect(() => {
    setFormData({
      username: profile.username || '',
      email: profile.email || '',
      bio: profile.bio || '',
      profilePic: profile.profilePic || ''
    })
  }, [profile])

  // fetch followers and following data
  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const [followersData, followingData] = await Promise.all([
          getFollowers(axiosPrivate, userId),
          getFollowing(axiosPrivate, userId)
        ])
        setFollowers(followersData.data)
        setFollowing(followingData.data)
      } catch (err) {
        setError(err.response?.data.message || 'Failed to retrieve followers/following')
      }
    }

    fetchFollowData()
  }, [axiosPrivate, userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updateUser = await editUser(axiosPrivate, userId, formData)
      setProfile(updateUser.data)
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data.message || 'Failed to update profile')
    }
  }

  const handleShowFollowers = () => {
    setShowFollowers((prev) => !prev)
    setShowFollowing(false)
  }

  const handleShowFollowing = () => {
    setShowFollowing((prev) => !prev)
    setShowFollowers(false)
  }

  return (
    <>
      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles['edit-form']}>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Bio:
            <textarea name="bio" value={formData.bio} onChange={handleChange} />
          </label>
          <label>
            Profile Picture URL:
            <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        </form>
      ) : (
        <div className={styles['profile-container']}>
          {loading && <p>Loading profile...</p>}
          {error && <p>{error}</p>}

          <div className={styles['profile-header']}>

            <div className={styles['profile-pic']}>
              <img src={profile.profilePic || '/default-profile.svg'} alt='profile' />
            </div>

            <div className={styles['profile-info']}>

              <div className={styles['username-and-email-container']}>
                <p className={styles['username']}>{profile.username}</p>
                <p className={styles['email']}>{profile.email}</p>
              </div>

              <div className={styles['profile-sub-info']}>

                <div className={styles['posts-container']}>
                  <p>{profile?._count?.posts ?? 0}</p>
                  <p>posts</p>
                </div>

                <div className={styles['followers-container']}>
                  <p>{profile?._count?.followers ?? 0}</p>
                  <button onClick={handleShowFollowers} className={styles['toggle-button']}>
                    followers
                  </button>
                </div>

                <div className={styles['following-container']}>
                  <p>{profile?._count?.following ?? 0}</p>
                  <button onClick={handleShowFollowing} className={styles['toggle-button']}>
                    following
                  </button>
                </div>

              </div>

            </div>

          </div>

          <div className={styles['profile-bio']}>
            <p>{profile.bio}</p>
          </div>

          {auth.id === Number(userId) && (
            <button 
              className={styles['edit-button']}
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          )}

        </div>
      )}

      {showFollowers && <Followers followers={followers} onClose={handleShowFollowers} />}
      {showFollowing && <Following following={following} onClose={handleShowFollowing} />}

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
      
    </>

  )
}

export default Profile