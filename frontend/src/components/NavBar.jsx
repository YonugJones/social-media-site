import styles from '../styles/NavBar.module.css'
import useAuth from '../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { logoutUser } from '../api/authApi'

const NavBar = () => {
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
      setAuth(null)
      navigate('/login')
    } catch (err) {
      console.log('Logout failed:', err)
    }
  }

  return (
    <div className={styles['nav-bar']}>
      <div className={styles['nav-bar-left']}>
        <Link to='/' className={styles['homepage-link']}>
          <h2>Social Media App</h2>
        </Link>
      </div>
      <div className={styles['nav-bar-right']}>
        <div>{ `Welcome, ${auth.username}` }</div>
        <button className={styles['logout-button']} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default NavBar