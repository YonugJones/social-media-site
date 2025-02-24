import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { loginUser } from '../api/authApi'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/Login.module.css'

const Login = () => {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  // remove errMsg when input changes
  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await loginUser({ username, password })
      setAuth({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        accessToken: response.accessToken
      })
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server response')
      } else {
        console.log(err)
        setErrMsg(err.response.data.error || 'Login failed')
      }
    }
  }

  return (
    <div className={styles['login-container']}>
      <section className={styles['form-container']}>
        <p className={ errMsg ? styles['errmsg'] : styles['offscreen'] }>{errMsg}</p>
        <form className={styles['form']} onSubmit={handleSubmit}>
          <div className={styles['form-header']}>
            <h1>Log Into Social Media App</h1>
          </div>
          {/* USERNAME FIELD */}
          <label htmlFor='username' className={`${styles['login-label']} ${styles['username']}`}></label>
          <input 
            className={styles['login-input']}
            type='text' 
            id='username'
            autoComplete='on'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder='Username'
            required
          />
          <p className={styles['try-field']}>Try: Guest</p>
          {/* PASSWORD FIELD */}
          <label htmlFor='password' className={styles['login-label password']}></label>
          <input 
            className={styles['login-input']}
            type='password' 
            id='password'
            autoComplete='off'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder='Password'
            required
          />
          <p className={styles['try-field']}>Try: GuestPass1!</p>
          <button className={styles['login-button']}>Login</button>
        </form>
        <div className={styles['signup-container']}>
          <p className={styles['signup-divide']}>Not registered?</p>
          <button className={styles['signup-button']}><Link to='/signup'>Create new account</Link></button>
        </div>
      </section>
    </div>
  )
}

export default Login