// consumes the AuthContext and it used by other components that need global auth state

import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

const useAuth = () => {
  return useContext(AuthContext)
}

export default useAuth