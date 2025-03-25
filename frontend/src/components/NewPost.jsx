// component allows users to create a post
import { useState, useEffect } from 'react'
import usePostActions from '../hooks/usePostActions'
import styles from '../styles/NewPost.module.css'

const NewPost = () => {
  const { createPost } = usePostActions()
  const [content, setContent] = useState('')
  const [success, setSuccess] = useState(false)
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
        await createPost(content)
        setContent('')  
        setSuccess(true)
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
      {success && <p className={styles['success-msg']}>Post created successfully</p>}
      {errMsg && <p className={styles['err-msg']}>{errMsg}</p>}
    </>
  )
}

export default NewPost