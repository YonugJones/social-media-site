import UsersList from './UsersList'
import styles from '../styles/Overlay.module.css'

const Followers = ({ followers, onClose }) => {
  return (
    <div className={styles['overlay']}>
      <div className={styles['overlay-content']}>
        <h2>Followers</h2>
        <button onClick={onClose} className={styles['close-button']}>X</button>
        <UsersList users={followers} />
      </div>
    </div>
  )
}

export default Followers