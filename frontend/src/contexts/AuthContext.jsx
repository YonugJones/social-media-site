import PropTypes from 'prop-types'
import { createContext, useState } from 'react'

// Create an auth context which will store global auth state to be used by other components
const AuthContext = createContext({})

// AuthProvider will wrap around the application and be consumed by components that need auth state
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      { children }
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthContext