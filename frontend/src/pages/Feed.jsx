// fetches user feed posts and displays on PostList component
import usePostFetch from '../hooks/usePostFetch'
import usePost from '../hooks/usePost'
import { useEffect } from 'react'
import PostList from '../components/PostList'
import NewPost from '../components/NewPost'
import styles from '../styles/UserFeed.module.css'

const Feed = () => {
  const { getFeed } = usePostFetch()
  const { posts } = usePost()

  useEffect(() => {
    getFeed()
  }, [getFeed])

  console.log('Feed component getting posts:', posts)

  return (
    <div className={styles['feed-container']}>
      <NewPost />
      <PostList posts={posts} />
    </div>
  )
}

export default Feed