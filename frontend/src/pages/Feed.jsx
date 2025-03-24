// fetches user feed and handles post state management
import { useEffect } from 'react'
import usePost from '../hooks/usePost'
import usePostFetch from '../hooks/usePostFetch'
import usePostActions from '../hooks/usePostActions'
import PostList from '../components/PostList'
import NewPost from '../components/NewPost'
import styles from '../styles/UserFeed.module.css'

const Feed = () => {
  const { posts, setPosts } = usePost()
  const { getFeed } = usePostFetch()
  const { createPost, editPost, deletePost, toggleLike } = usePostActions()

  // useEffect fetches feed on mount and cleans posts state on dismount
  useEffect(() => {
    getFeed()
    return () => setPosts([])
  }, [getFeed, setPosts])

  // handlers for user actions
  const handleNewPost = async (content) => {
    const newPost = await createPost(content)
    setPosts((prevPosts) => [newPost, ...prevPosts])
  }

  const handleEditPost = async (postId, content) => {
    const updatedPost = await editPost(postId, content)
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updatedPost : post))
    )
  }

  const handleDeletePost = async (postId) => {
    await deletePost(postId)
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
  }

  const handleLikeToggle = async (postId) => {
    const updatedPost = await toggleLike(postId)
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updatedPost : post))
    )
  }

  return (
    <div className={styles['feed-container']}>
      <NewPost onNewPost={handleNewPost} />
      <PostList 
        posts={posts} 
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        onLikeToggle={handleLikeToggle}
      />
    </div>
  )
}

export default Feed