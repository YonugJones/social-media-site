// restructure of UserFeed with post context and hooks - March 22

import { useEffect } from 'react'
import usePost from '../hooks/usePost'
import usePostFetch from '../hooks/usePostFetch'
import usePostActions from '../hooks/usePostActions'
import PostCard from '../components/PostCard'
import styles from '../styles/UserFeed.module.css'

const Feed = () => {
  const { posts } = usePost()
  const { getFeed } = usePostFetch()
  const { toggleLike, handleDelete } = usePostActions()

  useEffect(() => {
    getFeed()
  }, [])

  return (
    <div className={styles['user-feed']}>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={() => toggleLike(post.id)}
              onDelete={() => handleDelete(post.id)}
            />
          ))
        ) : (
          <p>No posts to display</p>
        )}
      </ul>
    </div>
  )
}

export default Feed