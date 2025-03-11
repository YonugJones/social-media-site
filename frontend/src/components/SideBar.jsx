import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import styles from '../styles/SideBar.module.css'

const SideBar = () => {
  const { auth } = useAuth()

  return (
    <div className={styles['side-bar']}>
      <ul>
        <li><Link to='/' className={styles['home-link']}>HOME</Link></li>
        {/* <li>NEW MESSAGE</li> */}
        <li><Link to={`/profile/${auth.id}`}>PROFILE</Link></li>
      </ul>
    </div>
  )
}

export default SideBar