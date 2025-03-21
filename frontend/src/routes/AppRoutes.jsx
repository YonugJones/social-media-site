import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import UserFeed from '../pages/UserFeed'
import PostDetails from '../pages/PostDetails'
import Profile from '../pages/Profile'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <UserFeed /> },
          { path: '/posts/:postId', element: <PostDetails /> },
          { path: '/profile/:userId', element: <Profile /> } 
        ]
      }
    ]
  }
])

export default router