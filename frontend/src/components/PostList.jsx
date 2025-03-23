// should display a list of PostCard components
import PostCard from './PostCard' 

const PostList = ({ posts }) => {
  return (
    <div>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) =>
            <PostCard 
              key={post.id}
              post={post}
            />
          )
        ) : (
          <p>No posts to display</p>
        )}
      </ul>
    </div>
  )
}

export default PostList
