import UsersList from './UsersList'
import styles from '../styles/Overlay.module.css'

const Following = ({ following, onClose }) => {
  return (
    <div className={styles['overlay']}>
      <div className={styles['overlay-content']}>
        <button onClick={onClose} className={styles['close-button']}>X</button>
        <UsersList users={following} type='following' />
      </div>
    </div>
  );
};

export default Following;
