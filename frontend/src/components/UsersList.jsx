import UserCard from './UserCard'
import styles from '../styles/UsersList.module.css'

const UsersList = ({ users, following, type, onAction, profileOwnerId }) => {
  return (
    <div className={styles['users-list-container']}>
      <h2>{type === 'followers' ? 'Followers' : 'Following'}</h2>
      {users.length === 0 ? (
        <p>No {type} yet</p>
      ) : (
        users.map((user) =>
          <UserCard 
            key={user.id} 
            user={user} 
            following={following}
            type={type} 
            onAction={onAction} 
            profileOwnerId={profileOwnerId}
          />
        )
      )}
    </div>
  )
} 

export default UsersList