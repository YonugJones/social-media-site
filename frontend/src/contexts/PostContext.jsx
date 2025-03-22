import { createContext, useState } from 'react'

const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])

  const addPost = (newPost) => setPosts((prev) => [newPost, ...prev])
  const editPost = (updatedPost) => setPosts((prev) =>
    prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
  )
  const deletePost = (postId) => setPosts((prev) =>
    prev.filter((post) => post.id !== postId)
  ) 

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost, editPost, deletePost }}>
      {children}
    </PostContext.Provider>
  )
}

export default PostContext