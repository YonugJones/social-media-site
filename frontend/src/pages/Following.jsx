// fetches user friendship and handles friendship state management, displays FriendCard and UsersList
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFriendship from '../hooks/useFriendship'
import useFriendshipFetch from '../hooks/useFriendshipFetch'
import useFriendshipActions from '../hooks/useFriendshipActions'
import FriendList from '../components/FriendList'

const Following = () => {
  const { userId } = useParams()
  const { following, setFollowing } = useFriendship()
  const { fetchFollowing } = useFriendshipFetch()
  const { unfollow } = useFriendshipActions()

  useEffect(() => {
    fetchFollowing(userId)
    return () => setFollowing([])
  }, [fetchFollowing, setFollowing, userId])

  const handleUnfollow = async (userId) => {
    const success = await unfollow(userId)
    if (success) {
      setFollowing((prevFollowing) => prevFollowing.filter(f => f.id !== userId))
    }
  }

  return (
    <>
      <h2>Following</h2>
      <FriendList 
        users={following}
        onUnfollow={handleUnfollow}
      />
    </>
  )
}

export default Following
