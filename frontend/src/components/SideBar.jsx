import styles from '../styles/SideBar.module.css'

const SideBar = () => {
  return (
    <div className={styles['side-bar']}>
      <ul>
        <li>NEW POST</li>
        <li>NEW MESSAGE</li>
        <li>FOLLWERS</li>
        <li>FOLLOWING</li>
        <li>PROFILE</li>
      </ul>
    </div>
  )
}

export default SideBar