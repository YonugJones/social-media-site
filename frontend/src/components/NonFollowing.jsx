import UsersList from './UsersList'
import styles from '../styles/Overlay.module.css'

const NonFollowing = ({ nonFollowing, prendingRequests, onClose, onAction, profileOwnerId }) => {
  return (
    <div className={styles['overlay']}>
      <div className={styles['overlay-content']}>
        <button onClick={onClose} className={styles['close-button']}>X</button>
        <UsersList 
          users={nonFollowing} 
          type='nonFollowing' 
          onAction={onAction} 
          prendingRequests={prendingRequests}
          profileOwnerId={profileOwnerId}
        />
      </div>
    </div>
  )
}

export default NonFollowing