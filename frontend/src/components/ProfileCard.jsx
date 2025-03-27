import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/ProfileCard.module.css'

const ProfileCard = ({ user, onEdit, onDelete }) => {
  const { auth } = useAuth()
  const [isEditing, setIsEditng] = useState(false)
  const [editData, setEditData] = useState({
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    profilePic: user.profilePic || ''
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditClick = () => {
    setIsEditng(true)
  }

  const handleSaveEdit = () => {
    onEdit(user.id, editData)
    setIsEditng(false)
  }

  const handleCancelEdit = () => {
    setIsEditng(false)
  }

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm('Deleting your profile is permanent. Are you sure?')
    if (confirmDelete) {
      onDelete(user.id)
      navigate('/signup')
    }
  }

  return (
    <>
      {isEditing ? (
        <form className={styles['edit-form']}>
          <label>
            Username:
            <input 
              type='text' 
              name='username' 
              value={editData.username} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Email:
            <input 
              type='email' 
              name='email' 
              value={editData.email} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Bio:
            <textarea 
              name='bio' 
              value={editData.bio} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Profile Picture URL:
            <input 
              type='text' 
              name='profilePic' 
              value={editData.profilePic} 
              onChange={handleChange} 
            />
          </label>
          <button type='button' onClick={handleSaveEdit}>Save</button>
          <button type='button' onClick={handleCancelEdit}>Cancel</button>
        </form>
      ) : (
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
                {/* REMOVED FOLLOWERS WHILE follower info is taken out of getUser backend res */}
                {/* <div className={styles['followers-container']}>
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
                </div> */}
              </div>
            </div>
          </div>
          <div className={styles['bio']}>
            <p>{user.bio}</p>
          </div>
          {auth.id === Number(user.id) && (
            <div className={styles['edit-delete-buttons']}>
              <button 
                className={styles['edit-button']}
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
              <button 
                className={styles['delete-button']}
                onClick={handleDeleteClick}
              >
                Delete Profile
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ProfileCard