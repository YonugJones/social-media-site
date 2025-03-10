import { Link } from 'react-router-dom'
import styles from '../styles/SideBar.module.css'

const SideBar = () => {
  return (
    <div className={styles['side-bar']}>
      <ul>
        <li><Link to='/' className={styles['home-link']}>HOME</Link></li>
        {/* <li>NEW MESSAGE</li> */}
        <li>PROFILE</li>
      </ul>
    </div>
  )
}

export default SideBar