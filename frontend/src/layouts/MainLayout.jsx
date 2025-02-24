import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import styles from '../styles/MainLayout.module.css'

const MainLayout = () => {
  return (
    <div className={styles['main-layout']}>
      <NavBar />
      <div className={styles['content']}>
        <SideBar />
        <div className={styles['outlet']}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout