import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import Feed from '../pages/Feed'
import PostDetails from '../pages/PostDetails'

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
          { path: '/', element: <Feed /> },
          { path: '/posts/:postId', element: <PostDetails /> }
        ]
      }
    ]
  }
])

export default router