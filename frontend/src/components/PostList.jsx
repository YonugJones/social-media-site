// should display a list of PostCard components
import PostCard from './PostCard' 

const PostList = ({ posts, onEdit, onDelete, onLikeToggle }) => {
  return (
    <div>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) =>
            <PostCard 
              key={post.id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
              onLikeToggle={onLikeToggle}
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
