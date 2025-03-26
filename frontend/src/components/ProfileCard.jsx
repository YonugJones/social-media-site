// import { useState } from 'react'
// import useAuth from '../hooks/useAuth'
import styles from '../styles/ProfileCard.module.css'

const ProfileCard = ({ user }) => {
  // const { auth } = useAuth()
  // const [isEditing, setIsEditng] = useState(false)
  // const [editData, setEditData] = useState({
  //   username: user.username || '',
  //   email: user.email || '',
  //   bio: user.bio || '',
  //   profilePic: user.profilePic || ''
  // })

  return (
    <div className={styles['profile-card-container']}>

      <div className={styles['header']}>
        <div className={styles['profile-pic']}>
          <img src={user.profilePic || '/default-profile.svg'} alt='profile' />
        </div>
        <div className={styles['info']}>
          <div className={styles['username-and-email-container']}>
            <p className={styles['username']}>{user.username}</p>
            <p className={styles['email']}>{user.email}</p>
          </div>
          <div className={styles['profile-sub-info']}>
            <div className={styles['posts-container']}>
              <p>{user?._count?.posts ?? 0}</p>
              <p>posts</p>
            </div>
            <div className={styles['followers-container']}>
              <p>{user?._count?.followers ?? 0}</p> 
              <button className={styles['toggle-button']}>
                followers
              </button>
            </div>
            <div className={styles['following-container']}>
              <p>{user?._count?.following ?? 0}</p>
              <button className={styles['toggle-button']}>
                following
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['bio']}>
        <p>{user.bio}</p>
      </div>
    </div>
  )
}

export default ProfileCard