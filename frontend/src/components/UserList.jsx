import UserCard from './UserCard'
import styles from '../styles/UsersList.module.css'

const UserList = ({ users, onFollow, onConfirm, onReject, onRemove }) => {
  return (
    <div className={styles['users-list-container']}>
      <ul>
        {users.length > 0 ? (
          users.map((user) =>
            <UserCard 
              key={user.id}
              user={user}
              onFollow={onFollow}
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

export default UserList
