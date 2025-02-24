import styles from '../styles/NavBar.module.css'
import useAuth from '../hooks/useAuth'

const NavBar = () => {
  const { auth } = useAuth()

  return (
    <div className={styles['nav-bar']}>
      <div className={styles['nav-bar-left']}>
        <h2>Social Media App</h2>
      </div>
      <div className={styles['nav-bar-right']}>
        <div>{ `Welcome, ${auth.username}` }</div>
        <div><button>Logout</button></div>
      </div>
    </div>
  )
}

export default NavBar