import useAuth from '../hooks/useAuth'
import styles from '../styles/UserCard.module.css'

const UserCard = ({ user, type, following, onAction, profileOwnerId }) => {
  const { auth } = useAuth()
  const isAlreadyFollowing = following?.some(f => f.id === user.id)
  const isProfileOwner = auth.id === profileOwnerId
  const isPendingRequest = user.isConfirmed === false

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

      {isProfileOwner && (
        <div className={styles['actions']}>
          {isPendingRequest ? (
            <>
              <button onClick={() => onAction('confirm', user.id)}>Confirm</button>
              <button onClick={() => onAction('reject', user.id)}>Reject</button>
            </>
          ) : type === 'followers' ? (
            <>
              {!isAlreadyFollowing && (
                <button onClick={() => onAction('followBack', user.id)}>Follow Back</button>
              )}
              <button onClick={() => onAction('remove', user.id)}>Remove</button>
            </>
          ) : (
            <button onClick={() => onAction('unfollow', user.id)}>Unfollow</button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserCard

