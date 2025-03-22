import UserCard from './UserCard'
import styles from '../styles/UsersList.module.css'

const UsersList = ({ users, following, type, pendingRequests, onAction, profileOwnerId }) => {
  return (
    <div className={styles['users-list-container']}>
      <h2>
        {type === 'followers' ? 'Followers' : 
        type === 'following' ? 'Following' : 
        'Users you can follow'}
      </h2>
      {users.length === 0 ? (
        <p>No {type}</p>
      ) : (
        users.map((user) =>
          <UserCard 
            key={user.id} 
            user={user} 
            following={following}
            type={type} 
            pendingRequests={pendingRequests}
            onAction={onAction} 
            profileOwnerId={profileOwnerId}
          />
        )
      )}
    </div>
  )
} 

export default UsersList