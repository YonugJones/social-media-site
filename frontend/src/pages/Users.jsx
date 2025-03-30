// fetches user friendship and handles friendship state management, displays FriendCard and UsersList

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFriendship from '../hooks/useFriendship'
import useFriendshipFetch from '../hooks/useFriendshipFetch'
import useFriendshipActions from '../hooks/useFriendshipActions'
import FriendList from '../components/FriendList'

const Users = () => {
  const { userId } = useParams()
  const { users, setUsers } = useFriendship()
  const { fetchAllUsers } = useFriendshipFetch()
  const { sendFollowRequest, unfollow, removeFollower } = useFriendshipActions()

  useEffect(() => {
    fetchAllUsers(userId)
    return () => setUsers([])
  }, [fetchAllUsers, setUsers, userId])

  const handleSendRequest = async (targetUserId) => {
    const confirmedRequest = await sendFollowRequest(targetUserId)
    if (confirmedRequest) fetchAllUsers(userId)  
  }

  const handleUnfollow = async (targetUserId) => {
    const confirmedUnfollow = await unfollow(targetUserId)
    if (confirmedUnfollow) fetchAllUsers(userId) 
  }

  const handleRemoveFollower = async (targetUserId) => {
    const confirmedUnFollow = await removeFollower(targetUserId)
    if (confirmedUnFollow) fetchAllUsers(userId) 
  }

  return (
    <>
      <h2>All Users</h2>
      <FriendList
        users={users}
        onFollow={handleSendRequest}
        onUnfollow={handleUnfollow}
        onRemove={handleRemoveFollower}
      />
    </>
  )
}

export default Users
