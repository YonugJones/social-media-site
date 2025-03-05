import { useState, useEffect } from 'react'
import { getPost } from '../api/postApi'
import useAxiosPrivate from './useAxiosPrivate'

const usePost = (postId) => {
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      try {
        const response = await getPost(axiosPrivate, postId)
        setPost(response.data)
      } catch (err) {
        setError(err)
      }
    }

    fetchPost()
  }, [axiosPrivate, postId])

  return { post, error }
}

export default usePost