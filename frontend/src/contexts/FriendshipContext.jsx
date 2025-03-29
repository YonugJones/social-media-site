import { createContext, useState } from 'react'

const FriendshipContext = createContext()

export const FriendshipProvider = ({ children }) => {
  const [followers, setFollowers] = useState([])
  const [pendingFollowers, setPendingFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [pendingFollowing, setPendingFollowing] = useState([])

  return (
    <FriendshipContext.Provider 
      value={{ 
        followers, 
        setFollowers, 
        pendingFollowers, 
        setPendingFollowers, 
        following, 
        setFollowing, 
        pendingFollowing, 
        setPendingFollowing 
      }}
    >
      {children}
    </FriendshipContext.Provider>
  )
}

export default FriendshipContext