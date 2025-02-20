import { Outlet } from 'react-router-dom'
import styles from '../styles/MainLayout.module.css'

const MainLayout = () => {
  return (
    <div className={styles['main-layout']}>
      {/* <Navbar /> */}
      <div className={styles['content']}>
        {/* <Sidebar /> */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout