// component allows users to create a post
import { useState, useEffect } from 'react'
import styles from '../styles/NewPost.module.css'

const NewPost = ({ onNewPost }) => {
  const [content, setContent] = useState('')
  const [errMsg, setErrMsg] = useState('')

  // remove errMsg when input changes
  useEffect(() => {
    setErrMsg('')
  }, [content])

  const handleChange = (e) => {
    setContent(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (content.trim()) {
      try {
        onNewPost(content)
        setContent('')  
      } catch (err) {
        setErrMsg(err.message || 'Failed to create post. Please try again.')
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
      {errMsg && <p className={styles['err-msg']}>{errMsg}</p>}
    </>
  )
}

export default NewPost