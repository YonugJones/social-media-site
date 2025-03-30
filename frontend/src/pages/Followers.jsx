// fetches user friendship and handles friendship state management, displays FriendCard and UsersList

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFriendship from '../hooks/useFriendship'
import useFriendshipFetch from '../hooks/useFriendshipFetch'
import useFriendshipActions from '../hooks/useFriendshipActions'
import FriendList from '../components/FriendList'

const Followers = () => {
  const { userId } = useParams()
  const { followers, setFollowers } = useFriendship()
  const { fetchFollowers } = useFriendshipFetch()
  const { sendFollowRequest, removeFollower } = useFriendshipActions()

  useEffect(() => {
    if (userId) {
      fetchFollowers(userId)
    }
    return () => setFollowers([]);
  }, [fetchFollowers, setFollowers, userId])

  const handleSendRequest = async (targetUserId) => {
    const confirmedRequest = await sendFollowRequest(targetUserId)
    if (confirmedRequest) fetchFollowers(userId)
  }

  const handleRemove = async (targetUserId) => {
    const confirmedRemove = await removeFollower(targetUserId)
    if (confirmedRemove) fetchFollowers(userId)
  }

  return (
    <>
      <h2>Followers</h2>
      <FriendList 
        users={followers}
        onFollow={handleSendRequest}
        onRemove={handleRemove}
      />
    </>
  )
}

export default Followers
