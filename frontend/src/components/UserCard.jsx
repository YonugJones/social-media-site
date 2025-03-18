import useAuth from '../hooks/useAuth'
import styles from '../styles/UserCard.module.css'

const UserCard = ({ user, type, following, onAction, profileOwnerId }) => {
  const { auth } = useAuth()
  const isAlreadyFollowing = following?.some(f => f.id === user.id)

  const isProfileOwner = auth.id === profileOwnerId

  return (
    <div className={styles['user-card']}>
      <div className={styles['user-info']}>
        <div className={styles['profile-pic']}>
          <img 
            src={user.profilePic || '/default-profile.svg'} 
            alt={`${user.username}'s profile`} 
          />
        </div>
        <p>{user.username}</p>
      </div>
      <div className={styles['actions']}>
        {user.isConfirmed === false ? (
          <>
            {isProfileOwner && (
              <>
                <button onClick={() => onAction('confirm', user.id)}>Confirm</button>
                <button onClick={() => onAction('reject', user.id)}>Reject</button>
              </>
            )}
          </>
        ) : type === 'followers' ? (
          <>
            {isProfileOwner && !isAlreadyFollowing && ( 
              <button onClick={() => onAction('followBack', user.id)}>Follow Back</button>
            )}
            {isProfileOwner && (
              <button onClick={() => onAction('remove', user.id)}>Remove</button>
            )}
          </>
        ) : (
          isProfileOwner && <button onClick={() => onAction('unfollow', user.id)}>Unfollow</button>
        )}
      </div>
    </div>
  )
}

export default UserCard

