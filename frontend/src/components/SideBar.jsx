import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import styles from '../styles/SideBar.module.css'

const SideBar = () => {
  const { auth } = useAuth()


  return (
    <div className={styles['side-bar']}>
      <ul className={styles['side-bar-links']}>
        <li className={styles['home-link']}>
          <Link to='/' className={styles['link']}>HOME</Link>
        </li>
        <li className={styles['profile-link']}>
          <Link to={`/profile/${auth.id}`} className={styles['link']}>PROFILE</Link>
        </li>
        <li className={styles['friendship-requests-link']}>
         <Link to={`/profile/${auth.id}/follow-requests`} className={styles['link']}>FRIENDSHIP REQUESTS</Link>
        </li>
      </ul>
    </div>
  )
}

export default SideBar

// import { useState, useEffect } from 'react'
// import { getNonFollowing, sendFollowRequest } from '../api/friendshipApi'
// import NonFollowing from './NonFollowing'
// import useAxiosPrivate from '../hooks/useAxiosPrivate'
// import useAuth from '../hooks/useAuth'
// import { Link } from 'react-router-dom'
// import styles from '../styles/SideBar.module.css'

// const SideBar = () => {
//   const { auth } = useAuth()
//   const axiosPrivate = useAxiosPrivate()
//   const [pendingRequests, setPendingRequests] = useState([])
//   const [showNonFollowing, setShowNonFollowing] = useState(false)
//   const [nonFollowing, setNonFollowing] = useState([])

//   useEffect(() => {
//     if (showNonFollowing) {
//       const fetchNonFollowing = async () => {
//         try {
//           const response = await getNonFollowing(axiosPrivate, auth.id)
//           setNonFollowing(response.data)
//         } catch (err) {
//           console.error('Failed to fetch non following users', err)
//         }
//       }
//       fetchNonFollowing()
//     }
//   }, [showNonFollowing, axiosPrivate, auth.id])

//   const handleAction = async (action, userId) => {
//     if (action === 'follow') {
//       await sendFollowRequest(axiosPrivate, userId)
//       setPendingRequests((prev) => [...prev, userId])
//       setNonFollowing((prev) => prev.filter(user => user.id !== userId))
//     }
//   }

//   return (
//     <div className={styles['side-bar']}>
//       <ul className={styles['side-bar-links']}>
//         <li className={styles['home-link']}>
//           <Link to='/' className={styles['link']}>HOME</Link>
//         </li>
//         <li className={styles['profile-link']}>
//           <Link to={`/profile/${auth.id}`} className={styles['link']}>PROFILE</Link>
//         </li>
//         <li className={styles['find-users-list-item']}>
//           <button className={styles['find-users-button']} onClick={() => setShowNonFollowing(!showNonFollowing)}>
//             FIND USERS
//           </button>
//         </li>
//       </ul>
//       {showNonFollowing && (
//         <NonFollowing 
//           nonFollowing={nonFollowing}
//           pendingRequests={pendingRequests}
//           onClose={() => setShowNonFollowing(false)}
//           onAction={handleAction}
//           profileOwnerId={auth.id}
//         />
//       )}
//     </div>
//   )
// }

// export default SideBar