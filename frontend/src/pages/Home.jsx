import { useState, useEffect } from 'react'
import { getFeedPosts } from '../api/postApi'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PostDetails from './PostDetails'
import styles from '../styles/Home.module.css'

const Home = () => {
  // const [posts, setPosts] = useState([])
  // const axiosPrivate = useAxiosPrivate()

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const data = await getFeedPosts(axiosPrivate)
  //       console.log('data:', data)
  //       setPosts(data.data)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  //   fetchPosts()
  // }, [axiosPrivate])

  return (
    <h2>HOME</h2>
    // <div className={styles['home']}>
    //   <h2>Home Feed</h2>
    //   {posts.length > 0 ? (
    //     posts.map(post => <PostDetails key={post.id} post={post} />)
    //   ) : (
    //     <p>No posts available</p>
    //   )}
    // </div>
  )
}

export default Home