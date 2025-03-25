import { useState } from 'react'
import styles from '../styles/NewComment.module.css'

const NewComment = ({ onNewComment }) => {
  const [content, setContent] = useState('')

  const handleChange = (e) => {
    setContent(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onNewComment(content)
      setContent('')
    }
  }

  return (
    <div className={styles['new-comment']}>
      <form onSubmit={handleSubmit} className={styles['new-comment-form']}>
        <textarea 
          value={content}
          onChange={handleChange}
          placeholder='Comment...'
          required
        />
        <button type='submit'>New Comment</button>
      </form>
    </div>
  )
}

export default NewComment