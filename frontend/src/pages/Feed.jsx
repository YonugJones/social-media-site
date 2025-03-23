// should display users feed
import { useEffect } from 'react'
import usePost from '../hooks/usePost'
import usePostFetch from '../hooks/usePostFetch'
import PostList from '../components/PostList'
import NewPost from '../components/NewPost'
import styles from '../styles/UserFeed.module.css'

const Feed = () => {
  const { posts } = usePost()
  const { getFeed } = usePostFetch()

  console.log('Feed component fetching post:', posts)

  useEffect(() => {
    getFeed()
  }, [getFeed])

  return (
    <div className={styles['feed-container']}>
      <NewPost />
      <PostList posts={posts} />
    </div>
  )
}

export default Feed