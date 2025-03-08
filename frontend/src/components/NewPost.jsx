import { useState } from 'react'
import { newPost } from '../api/postApi'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import styles from '../styles/NewPost.module.css'

const NewPost = ({ onPostAdded }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const handleChange = (e) => {
    setContent(e.target.value)
    setError(null)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await newPost(axiosPrivate, content)
      setContent('')
      setSuccess(true)
      onPostAdded(response.data)
    } catch (err) {
      setError(err.response?.data.message || 'Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['new-post']}>
      <form onSubmit={handleSubmit} className={styles['new-post-form']}>
      <textarea 
          name='content'
          id='content'
          value={content}
          onChange={handleChange}
          placeholder='Post...'
          required
        />
        <button type='submit' disabled={loading}> 
          {loading ? 'Creating...' : 'New post'}
        </button>
      </form>
      {success && <p className="success-message">Post created successfully!</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default NewPost