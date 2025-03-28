import { useContext } from 'react'
import FriendshipContext from '../contexts/FriendshipContext'

const useFriendship = () => {
  return useContext(FriendshipContext)
}

export default useFriendship