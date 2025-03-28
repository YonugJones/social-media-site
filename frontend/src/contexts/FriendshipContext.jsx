import { createContext, useState } from 'react'

const FriendshipContext = createContext()

export const FriendshipProvider = ({ children }) => {
  const [friendship, setFriendship] = useState([])
  
  return 
}

export default FriendshipContext