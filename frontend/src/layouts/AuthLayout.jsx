import { Outlet } from 'react-router-dom'
import styles from '../styles/AuthLayout.module.css'

const AuthLayout = () => {
  return (
    <div  className={styles['auth-layout']}>
      <Outlet />
    </div>
  )
}

export default AuthLayout