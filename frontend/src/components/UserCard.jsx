import styles from '../styles/UserCard.module.css'

const UserCard = ({ user, type, onAction }) => {
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
            <button onClick={() => onAction('accept', user.id)}>Accept</button>
            <button onClick={() => onAction('reject', user.id)}>Reject</button>
          </>
        ) : type === 'followers' ? (
          <button onClick={() => onAction('followBack', user.id)}>Follow Back</button>
        ) : (
          <button onClick={() => onAction('unfollow', user.id)}>Unfollow</button>
        )}
      </div>
    </div>
  )
}

export default UserCard