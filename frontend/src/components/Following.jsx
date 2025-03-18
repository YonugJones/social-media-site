import UsersList from './UsersList'
import styles from '../styles/Overlay.module.css'

const Following = ({ following, onClose, onAction, profileOwnerId }) => {
  return (
    <div className={styles['overlay']}>
      <div className={styles['overlay-content']}>
        <button onClick={onClose} className={styles['close-button']}>X</button>
        <UsersList 
          users={following} 
          type='following' 
          onAction={onAction} 
          profileOwnerId={profileOwnerId}
        />
      </div>
    </div>
  );
};

export default Following;
