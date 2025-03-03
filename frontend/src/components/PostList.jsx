// Component fetches getFeedPosts and displays in list

import { useState, useEffect } from 'react'
import { getFeedPosts } from '../api/postApi'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PostCard from './PostCard'
import styles from '../styles/PostList.module.css'

const PostList = () => {
  const [posts, setPosts] = useState([])
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getFeedPosts(axiosPrivate)
        setPosts(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchPost()
  }, [axiosPrivate])

  return (
    <div className={styles['post-list-container']}>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>No posts to display</p>
        )}
      </ul>
    </div>
  )
}

export default PostList