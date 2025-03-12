import { useState, useEffect } from 'react'
import { getUser, getPostsByUser, editUser } from '../api/userApi'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'
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
      const updateUser = await editUser(axiosPrivate, userId, formData.username, formData.email, formData.bio, formData.profilePic)
      setProfile(updateUser.data)
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data.message || 'Failed to update profile')
    }
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


/*
HOLD ONTO THIS:


for some reason the userId is being undefined. Here's the devTools log when I try and sve the editProfile formData:

:3000/users/undefined:1 
                     
Failed to load resource: the server responded with a status of 400 (Bad Request)


Where's the issue?


backend/controllers/userController.js:
const editUser = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = parseInt(req.params.userId)
  if (!userId) {
    throw new CustomError('Invalid User ID', 403)
  }

  const userProfile = await prisma.user.findUnique({ where: { id: userId } })
  if (!userProfile) {
    throw new CustomError('User not found', 401)
  }

  if (userProfile.id !== user.id) {
    throw new CustomError('Unauthorized: users can only update their own profile', 403)
  }

  const { username, email, bio, profilePic } = req.body;
  if (!username || !email) {
    throw new CustomError('Username and email field cannot be blank', 400)
  }

  const updatedProfile = await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      email,
      bio,
      profilePic
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      profilePic: true
    }
  })

  res.status(200).json({
    success: true,
    message: 'User profile updated',
    data: updatedProfile
  })
})
// end userController

userApi.js:
export const editUser = async (axiosPrivateInstance, userData) => {
  try {
    const response = await axiosPrivateInstance.put(`/users/${userData.userId}`)
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}
// end userApi

Profile.jsx:
import { useState, useEffect } from 'react'
import { getUser, getPostsByUser, editUser } from '../api/userApi'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'
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
      const updateUser = await editUser(axiosPrivate, userId, formData.username, formData.email, formData.bio, formData.profilePic)
      setProfile(updateUser.data)
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data.message || 'Failed to update profile')
    }
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
// end Profile

*/