import styles from '../styles/FriendCard.module.css'

const FriendCard = ({ user, onFollow, onUnfollow, onConfirm, onReject, onRemove }) => {

  const followButtonText = user.isFollowingPending ? 'Request Pending' : 'Follow';

  const handleFollow = async () => {
    if (onFollow) await onFollow(user.id);
  }

  const handleUnfollow = async () => {
    if (onUnfollow) await onUnfollow(user.id);
  }

  const handleConfirm = async () => {
    if (onConfirm) await onConfirm(user.id);
  }

  const handleReject = async () => {
    if (onReject) await onReject(user.id);
  }

  const handleRemove = async () => {
    if (onRemove) await onRemove(user.id);
  }

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
        {onFollow && !user.isFollowing && !user.isFollowingPending && (
          <button onClick={handleFollow}>{followButtonText}</button>
        )}
        {onFollow && user.isFollowingPending && (
          <button disabled>{followButtonText}</button>
        )}
        {user.isFollowing && onFollow && (
          <button disabled>Following Back</button>
        )}
        {onUnfollow && (
          <button onClick={handleUnfollow}>Unfollow</button>
        )}
        {onConfirm && <button onClick={handleConfirm}>Confirm</button>}
        {onReject && <button onClick={handleReject}>Reject</button>}
        {onRemove && <button onClick={handleRemove}>Remove</button>}
      </div>
    </div>
  )
}

export default FriendCard;
