// should display a list of CommentCard components
import CommentCard from './CommentCard'

const CommentList = ({ comments, onEdit, onDelete, onLikeToggle }) => {
  return (
    <div>
      <ul>
        {comments.length > 0 ? (
          comments.map((comment) =>
            <CommentCard 
              key={comment.id}
              comment={comment}
              onEdit={onEdit}
              onDelete={onDelete}
              onLikeToggle={onLikeToggle}
            />
          )
        ): (
          <p>No comments to display</p>
        )}
      </ul>
    </div>
  )
}

export default CommentList