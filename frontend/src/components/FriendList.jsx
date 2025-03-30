import FriendCard from './FriendCard'
import styles from '../styles/FriendList.module.css'

const FriendList = ({ users, onFollow, onUnfollow, onConfirm, onReject, onRemove }) => {
  return (
    <div className={styles['users-list-container']}>
      <ul>
        {users?.length > 0 ? (
          users.map((user) =>
            <FriendCard 
              key={user.id}
              user={user}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              onConfirm={onConfirm}
              onReject={onReject}
              onRemove={onRemove}
            />
          )
        ) : (
          <p>No users to display</p>
        )}
      </ul>
    </div>
  )
} 

export default FriendList
