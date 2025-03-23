import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePostActions from '../hooks/usePostActions'
import styles from '../styles/NewPost.module.css'

const NewPost = () => {
  const { newPost } = usePostActions()
  const [content, setContent] = useState('')
  const [success, setSuccess] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const navigate = useNavigate()

  // remove errMsg when input changes
  useEffect(() => {
    setErrMsg('')
  }, [content])

  const handleChange = (e) => {
    setContent(e.target.value)
  }

  const handleSubmit = async () => {
    if (content.trim()) {
      try {
        await newPost(content)
        setContent('')  
        setSuccess(true)
        navigate('/')
      } catch (err) {
        setErrMsg(err)
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles['new-post-form']}>
        <textarea 
          value={content} 
          onChange={handleChange} 
          placeholder='Have something to say?'
        />
        <button type='submit'>Post</button>
      </form>
      {success && <p>Post created successfully</p>}
      {errMsg && <p>{errMsg}</p>}
    </>
  )
}

export default NewPost


  // const handleChange = (e) => {
  //   setContent(e.target.value)
  //   setError(null)
  //   setLoading(false)
  // }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!content.trim()) {
  //     setError('Post content cannot be empty.')
  //     return
  //   }
  //   setLoading(true)

  //   try {
  //     const response = await newPost(axiosPrivate, content)
  //     setContent('')
  //     setSuccess(true)
  //     if (onPostAdded) {
  //       onPostAdded(response.data)
  //     }
  //     navigate('/')
  //   } catch (err) {
  //     setError(err.response?.data.message || 'Failed to create post')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // return (
  //   <div className={styles['new-post']}>
  //     <form onSubmit={handleSubmit} className={styles['new-post-form']}>
  //     <textarea 
  //         name='content'
  //         id='content'
  //         value={content}
  //         onChange={handleChange}
  //         placeholder='Post...'
  //         required
  //       />
  //       <button type='submit' disabled={loading}> 
  //         {loading ? 'Creating...' : 'New post'}
  //       </button>
  //     </form>
  //     {success && <p className="success-message">Post created successfully!</p>}
  //     {error && <p className="error-message">{error}</p>}
  //   </div>
  // )