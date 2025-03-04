import useFeedPosts from '../hooks/useFeedPosts'
import PostCard from './PostCard'
import styles from '../styles/PostList.module.css'

const PostList = () => {
  const { posts, error } = useFeedPosts()

  return (
    <div className={styles['post-list']}>
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

export default PostList