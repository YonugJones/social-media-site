// fetches user friendship and handles friendship state management, displays FriendCard and FriendList
import { useEffect } from 'react'
import useFriendship from '../hooks/useFriendship'
import useFriendshipFetch from '../hooks/useFriendshipFetch'
import useFriendshipActions from '../hooks/useFriendshipActions'
import { useParams } from 'react-router-dom'
import FriendList from '../components/FriendList'
import styles from '../styles/FriendshipRequests.module.css'

const FriendshipRequests = () => {
  const { pendingFollowers, setPendingFollowers } = useFriendship()
  const { fetchPendingFollowers } = useFriendshipFetch()
  const { confirmFollowRequest, rejectFollowRequest } = useFriendshipActions()
  const { userId } = useParams()

  // fetches pending follower list on mount, removes list on dismount
  useEffect(() => {
    fetchPendingFollowers(userId)
    return () => setPendingFollowers([])
  }, [fetchPendingFollowers, setPendingFollowers, userId])


  const handleConfirmRequest = async (followerId) => {
    const confirmedUser = await confirmFollowRequest(followerId) 
    if (confirmedUser) {
      setPendingFollowers((prevFollowers) =>
        prevFollowers.filter((user) => user.id !== confirmedUser.id)
      )
    }
  }

  const handleRejectRequest = async (followerId) => {
    const rejectedUserId = await rejectFollowRequest(followerId)
    if (rejectedUserId) {
      setPendingFollowers((prevFollowers) =>
        prevFollowers.filter((user) => user.id !== rejectedUserId)
      )
    }
  }

  return (
    <div className={styles['friendship-requests-container']}>
      <h2>Friendship Requests</h2>
      <FriendList 
        users={pendingFollowers}
        onConfirm={handleConfirmRequest}
        onReject={handleRejectRequest}
      />
    </div>
  )
}

export default FriendshipRequests