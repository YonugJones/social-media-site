// Imports
import { useState, useEffect } from 'react'
import { signupUser } from '../api/authApi'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import styles from '../styles/Signup.module.css'
// Declare regex variables
const USERNAME_REGEX = /^\S{3,24}$/
const EMAIL_REGEX = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/
const specialChars = '!?+-_,.=@#$%^&*|<>'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)

  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [validConfirmPassword, setValidConfirmPassword] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  // Validates username property
  useEffect(() => {
    const result = USERNAME_REGEX.test(username)
    setValidUsername(result)
  }, [username])

  // Validates email property
  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    setValidEmail(result)
  }, [email])

  // Validates password and confirmPassword property
  useEffect(() => {
    const result = PASSWORD_REGEX.test(password)
    setValidPassword(result)
    const confirm = password === confirmPassword
    setValidConfirmPassword(confirm)
  }, [password, confirmPassword])

  // Remove errMsg if input changes
  useEffect(() => {
    setErrMsg('')
  }, [username, email, password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await signupUser({ username, email, password, confirmPassword })
      setSuccess(true) 
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server response')
      } else {
        console.log(err)
        setErrMsg(err.response.data.error || 'Signup failed')
      }
    }
  }

  return (
    <div className={styles['signup-container']}>
      { success ? (
        <section className={styles['form-container']}>
          <h1>Success</h1>
          <Link to='/login'>Login</Link>
        </section>
      ) : (
        <section className={styles['form-container']}>
          <p className={ errMsg ? styles['errmsg'] : styles['offscreen'] }>{errMsg}</p>
          <form onSubmit={handleSubmit}>
          <div className={styles['form-header']}>
            <h1>Create a new account</h1>
            <p>It&apos;s quick and easy.</p>        
          </div>
            {/* USERNAME FIELD */}
            <label htmlFor='username' className={styles['signup-label']}>
              <span className={ validUsername ? styles['valid'] : styles['hide'] }>
                <FontAwesomeIcon icon={faCheck} aria-hidden='true' />
              </span>
              <span className={ validUsername || !username ? styles['hide'] : styles['invalid'] }>
                <FontAwesomeIcon icon={faTimes} aria-hidden='true' />
              </span>
            </label>
            <input 
              className={styles['signup-input']}
              type='text' 
              id='username'
              autoComplete='off'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder='Username'
              required
            />
            <p className={ username && !validUsername ? styles['instructions'] : styles['offscreen']}>
              <FontAwesomeIcon icon={faInfoCircle} aria-hidden='true' />
              Must have 3 to 24 characters <br />
              Username cannot contain spaces <br />
            </p>

            {/* EMAIL FIELD */}
            <label htmlFor='email' className={styles['signup-label']}>
              <span className={ validEmail ? styles['valid'] : styles['hide'] }>
                <FontAwesomeIcon icon={faCheck} aria-hidden='true' />
              </span>
              <span className={ validEmail || !email ? styles['hide'] : styles['invalid'] }>
                <FontAwesomeIcon icon={faTimes} aria-hidden='true' />
              </span>
            </label>  
            <input 
              className={styles['signup-input']}
              type='email' 
              id='email'
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder='Email'
              required
            />
            <p className={ email && !validEmail ? styles['instructions'] : styles['offscreen']}>
              <FontAwesomeIcon icon={faInfoCircle} aria-hidden='true' />
              Must be a valid email address <br />
            </p>

            {/* PASSWORD FIELD */}
            <label htmlFor='password' className={styles['signup-label']}>
              <span className={ validPassword ? styles['valid'] : styles['hide'] }>
                <FontAwesomeIcon icon={faCheck} aria-hidden='true' />
              </span>
              <span className={ validPassword || !password ? styles['hide'] : styles['invalid'] }>
                <FontAwesomeIcon icon={faTimes} aria-hidden='true' />
              </span>
            </label>
            <input 
              className={styles['signup-input']}
              type='password' 
              id='password'
              autoComplete='off'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='Password'
              required
            />
            <p className={ password && !validPassword ? styles['instructions'] : styles['offscreen'] }>
              <FontAwesomeIcon icon={faInfoCircle} aria-hidden='true' />
              Must be at least 10 characters <br />
              Password must contain upper and lower case letters, a number, and a special character <br />
              Allowed special characters: {specialChars}
            </p>
        
            {/* CONFIRM PASSWORD FIELD */}
            <label htmlFor='confirmPassword' className={styles['signup-label']}>
              <span className={ validConfirmPassword && confirmPassword ? styles['valid'] : styles['hide'] }>
                <FontAwesomeIcon icon={faCheck} aria-hidden='true' />
              </span>
              <span className={ validConfirmPassword || !confirmPassword ? styles['hide'] : styles['invalid'] }>
                <FontAwesomeIcon icon={faTimes} aria-hidden='true' />
              </span>
            </label>
            <input 
              className={styles['signup-input']}
              type='password' 
              id='confirmPassword'
              autoComplete='off'
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder='Confirm Password'
              required
            />
            <p className={ confirmPassword.length > 0 && !validConfirmPassword ? styles['instructions'] : styles['offscreen'] }>
              <FontAwesomeIcon icon={faInfoCircle} aria-hidden='true' />
              Passwords must match <br />
            </p>

            <button className={styles['signup-button']} disabled={ !validUsername || !validEmail || !validPassword || !validConfirmPassword ? true : false }>
              <strong>Signup</strong>
            </button>

          </form>
          <p>
            <span>
              <Link className={styles['login-link']} to='/login'>Already have an account?</Link>
            </span>
          </p>
        </section>
      ) }
    </div>
  )
}

export default Signup