import { useState, useEffect } from 'react'
import { getNonFollowing } from '../api/friendshipApi'
// import NonFollowing from './NonFollowing'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import styles from '../styles/SideBar.module.css'

const SideBar = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [showNonFollowing, setShowNonFollowing] = useState(false)
  const [nonFollowing, setNonFollowing] = useState([])

  useEffect(() => {
    if (showNonFollowing) {
      const fetchNonFollowing = async () => {
        try {
          const response = await getNonFollowing(axiosPrivate, auth.id)
          setNonFollowing(response.data)
        } catch (err) {
          console.error('Failed to fetch non following users', err)
        }
      }
      fetchNonFollowing()
    }
  }, [showNonFollowing, axiosPrivate, auth.id])

  // const handleAction = (action, userId) => {
  //   if (action === 'follow') {
  //     await 
  //   }
  // }

  return (
    <div className={styles['side-bar']}>
      <ul className={styles['side-bar-links']}>
        <li className={styles['home-link']}>
          <Link to='/' className={styles['link']}>HOME</Link>
        </li>
        <li className={styles['profile-link']}>
          <Link to={`/profile/${auth.id}`} className={styles['link']}>PROFILE</Link>
        </li>
      </ul>
    </div>
  )
}

export default SideBar