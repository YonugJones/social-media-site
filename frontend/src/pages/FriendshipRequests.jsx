// fetches user friendship and handles friendship state management, displays UserCard and UsersList
import { useEffect } from 'react'
import useFriendship from '../hooks/useFriendship'
import useFriendshipFetch from '../hooks/useFriendshipFetch'
import useFriendshipActions from '../hooks/useFriendshipActions'
import UserList from '../components/UserList'
import styles from '../styles/FriendshipRequests.module.css'

const FriendshipRequests = () => {
  const { followers, setFollowers, setFollowing } = useFriendship()
  const { getPendingFollowers } = useFriendshipFetch()
  const { sendFollowRequest, confirmFollowRequest, rejectFollowRequest } = useFriendshipActions()

  // fetches pending follower list on mount, removes list on dismount
  useEffect(() => {
    getPendingFollowers()
    return () => setFollowers([])
  }, [getPendingFollowers, setFollowers])

  const handleSendRequest = async (userId) => {
    const friendlist = await sendFollowRequest(userId)
    if (friendlist) setFollowing(friendlist)
  }

  const handleConfirmRequest = async (followerId) => {
    const newFriendList = await confirmFollowRequest(followerId) 
    if (newFriendList) {
      setFollowers(newFriendList)
      getPendingFollowers()
    }
  }

  const handleRejectRequest = async (followerId) => {
    const newFriendList = await rejectFollowRequest(followerId)
    if (newFriendList) {
      setFollowers(newFriendList)
      getPendingFollowers()
    }
  }

  return (
    <div className={styles['friendship-requests-containerr']}>
      <UserList 
        users={followers}
        onFollow={handleSendRequest}
        onConfirm={handleConfirmRequest}
        onReject={handleRejectRequest}
      />
    </div>
  )
}

export default FriendshipRequests