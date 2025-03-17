import UsersList from './UsersList'
import styles from '../styles/Overlay.module.css'

const Followers = ({ followers, onClose, onAction }) => {
  return (
    <div className={styles['overlay']}>
      <div className={styles['overlay-content']}>
        <button onClick={onClose} className={styles['close-button']}>X</button>
        <UsersList users={followers} type='followers' onAction={onAction} />
      </div>
    </div>
  )
}

export default Followers