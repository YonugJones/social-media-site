import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRoutes.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { PostProvider } from './contexts/PostContext.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import { FriendshipProvider } from './contexts/FriendshipContext.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PostProvider>
        <UserProvider>
          <FriendshipProvider>
            <RouterProvider router={router} />
          </FriendshipProvider>
        </UserProvider>
      </PostProvider>
    </AuthProvider>
  </StrictMode>,
)
