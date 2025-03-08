// import { useState, useEffect } from 'react'
// import { getFeedPosts } from '../api/postApi'
// import useAxiosPrivate from './useAxiosPrivate'

// const useFeedPosts = () => {
//   const [posts, setPosts] = useState([])
//   const [error, setError] = useState(null)
//   const axiosPrivate = useAxiosPrivate()

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await getFeedPosts(axiosPrivate)
//         setPosts(response.data)
//       } catch (err) {
//         setError(err)
//       }
//     }

//     fetchPosts()
//   }, [axiosPrivate])

//   return { posts, error }
// }

// export default useFeedPosts