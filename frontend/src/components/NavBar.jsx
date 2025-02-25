import styles from '../styles/NavBar.module.css'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
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
        <h2>Social Media App</h2>
      </div>
      <div className={styles['nav-bar-right']}>
        <div>{ `Welcome, ${auth.username}` }</div>
        <button className={styles['logout-button']} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default NavBar