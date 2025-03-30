import styles from '../styles/FriendCard.module.css'

const FriendCard = ({ user, onFollow, onUnfollow, onConfirm, onReject, onRemove }) => {

  const handleFollow = async () => {
    if (onFollow) await onFollow(user.id)
  }

  const handleUnfollow = async () => {
    if (onUnfollow) await onUnfollow(user.id)
  }

  const handleConfirm = async () => {
    if (onConfirm) await onConfirm(user.id)
  }

  const handleReject = async () => {
    if (onReject) await onReject(user.id)
  }

  const handleRemove = async () => {
    if (onRemove) await onRemove(user.id)
  }

  console.log('onRemove:', onRemove)
  console.log('user.isFollowing', user.isFollowing)

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
        {/* Followers.jsx and Users.jsx */}
        {onFollow && !user.isFollowing && !user.isFollowingPending && (
          <button onClick={handleFollow}>
            {user.isFollower ? 'Follow Back' : 'Follow'}
          </button>
        )}

        {/* Followers.jsx and Users.jsx */}
        {onFollow && user.isFollowingPending && (
          <button disabled>Request Pending</button>
        )}
        
        {/* FriendRequests.jsx */}
        {onConfirm && onReject && (
          <>
            <button onClick={handleConfirm}>Confirm Request</button>
            <button onClick={handleReject}>Reject Request</button>
          </>
        )}
        
        {/* Followers.jsx and Users.jsx */}
        {onRemove && onFollow && user.isFollower && !user.isFollowerPending && (
          <button onClick={handleRemove}>Remove Follower</button>
        )}

        {/* Following.jsx and Users.jsx */}
        {onUnfollow && user.isFollowing && (
          <button onClick={handleUnfollow}>Unfollow</button>
        )}
      </div>

    </div>
  )
}

export default FriendCard;
