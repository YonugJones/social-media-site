import { useState } from 'react'
import { newComment } from '../api/commentApi'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import styles from '../styles/NewComment.module.css'

const NewComment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const axiosPrivate = useAxiosPrivate()

  const handleChange = (e) => {
    setContent(e.target.value)
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await newComment(axiosPrivate, postId, content)
      setContent('')
      setSuccess(true)
      onCommentAdded(response.data)
    } catch (err) {
      setError(err.response?.data.message || 'Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['new-comment']}>
      <form onSubmit={handleSubmit} className={styles['new-comment-form']}>
        <textarea 
          name='content'
          id='content'
          value={content}
          onChange={handleChange}
          placeholder='Comment...'
          required
        />
        <button type='submit' disabled={loading}> 
          {loading ? 'Adding...' : 'Add comment'}
        </button>
      </form>
      {success && <p className="success-message">Comment added successfully!</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default NewComment