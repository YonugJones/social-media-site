import { createContext, useState } from 'react'

const FriendshipContext = createContext()

export const FriendshipProvider = ({ children }) => {
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  return (
    <FriendshipContext.Provider value={{ followers, setFollowers, following, setFollowing }}>
      {children}
    </FriendshipContext.Provider>
  )
}

export default FriendshipContext