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

  useEffect(() => {
    fetchPendingFollowers(userId)
    return () => setPendingFollowers([])
  }, [fetchPendingFollowers, setPendingFollowers, userId])


  const handleConfirmRequest = async (followerId) => {
    const confirmedUser = await confirmFollowRequest(followerId) 
    if (confirmedUser) fetchPendingFollowers(userId)
  }

  const handleRejectRequest = async (followerId) => {
    const rejectedUserId = await rejectFollowRequest(followerId)
    if (rejectedUserId) fetchPendingFollowers(userId)
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