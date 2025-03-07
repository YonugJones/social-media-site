import useFeedPosts from '../hooks/useFeedPosts'
import PostCard from '../components/PostCard'
import styles from '../styles/UserFeed.module.css'

const UserFeed = () => {
  const { posts, error } = useFeedPosts()

  return (
    <div className={styles['user-feed']}>
      {error && <p>Error loading posts</p>}
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>No posts to display</p>
        )}
      </ul>
    </div>
  )
}

export default UserFeed