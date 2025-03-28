// fetches user friendship and handles friendship state management, displays UserCard and UsersList
import { useEffect } from 'react'
import useFriendship from '../hooks/useFriendship'
import useFriendshipFetch from '../hooks/useFriendshipFetch'
import useFriendshipActions from '../hooks/useFriendshipActions'
import UserList from '../components/UserList'
import styles from '../styles/FriendshipRequests.module.css'

const FriendshipRequests = () => {
  const { followers, setFollowers } = useFriendship()
  const { getPendingFollowers } = useFriendshipFetch()
  const { confirmFollowRequest, rejectFollowRequest } = useFriendshipActions()

  // fetches pending follower list on mount, removes list on dismount
  useEffect(() => {
    getPendingFollowers()
    return () => setFollowers([])
  }, [getPendingFollowers, setFollowers])


  const handleConfirmRequest = async (followerId) => {
    const updatedFriendList = await confirmFollowRequest(followerId) 
    if (updatedFriendList) {
      setFollowers(updatedFriendList)
      getPendingFollowers()
    }
  }

  const handleRejectRequest = async (followerId) => {
    const updatedFriendList = await rejectFollowRequest(followerId)
    if (updatedFriendList) {
      setFollowers(updatedFriendList)
      getPendingFollowers()
    }
  }

  return (
    <div className={styles['friendship-requests-containerr']}>
      <h2>Friendship Requests</h2>
      <UserList 
        users={followers}
        onConfirm={handleConfirmRequest}
        onReject={handleRejectRequest}
      />
    </div>
  )
}

export default FriendshipRequests