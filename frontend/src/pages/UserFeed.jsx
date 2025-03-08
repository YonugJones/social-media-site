// fetches FeedPosts state and displays

import { useState, useEffect } from 'react'
import { getFeedPosts } from '../api/postApi'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PostCard from '../components/PostCard'
import styles from '../styles/UserFeed.module.css'

const UserFeed = () => {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getFeedPosts(axiosPrivate)
        setPosts(response.data)
      } catch (err) {
        setError(err)
      }
    }

    fetchPosts()
  }, [axiosPrivate])

  const handleToggleCommentForm = () => {
    console.log('you clicked the comment icon!')
  }

  return (
    <div className={styles['user-feed']}>
      {error && <p>Error loading posts</p>}
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} onToggleCommentForm={handleToggleCommentForm} />)
        ) : (
          <p>No posts to display</p>
        )}
      </ul>
    </div>
  )
}

export default UserFeed