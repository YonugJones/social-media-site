import { useState, useEffect } from 'react'
import
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
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
      </ul>
    </div>
  )
}

export default SideBar