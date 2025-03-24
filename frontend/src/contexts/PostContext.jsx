import { createContext, useState } from 'react'

const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState(null)

  return (
    <PostContext.Provider value={{ posts, setPosts, post, setPost }}>
      {children}
    </PostContext.Provider>
  )
}

export default PostContext