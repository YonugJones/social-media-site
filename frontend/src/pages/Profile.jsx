import { useState, useEffect } from 'react'
import { getUser } from '../api/userApi'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useParams } from 'react-router-dom'
import styles from '../styles/Profile.module.css'

const Profile = () => {
  // const [success, setSuccess] = useState(false)
  const { userId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // immeidately fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(axiosPrivate, userId)
        setProfile(response.data)
      } catch (err) {
        setError(err.response?.data.message || 'Failed to retrieve profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
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
      
    </div>
  )
}

export default Profile