import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import Feed from '../pages/Feed'
import Profile from '../pages/Profile'
import PostDetails from '../pages/PostDetails'
import FriendshipRequests from '../pages/FriendshipRequests'
import Followers from '../pages/Followers'
import Following from '../pages/Following'

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
          { path: '/profile/:userId', element: <Profile /> },
          { path: '/posts/:postId', element: <PostDetails /> },
          { path: '/profile/:userId/follow-requests', element: <FriendshipRequests /> },
          { path: '/friendship/:userId/followers', element: <Followers /> },
          { path: '/friendship/:userId/following', element: <Following /> }
        ]
      }
    ]
  }
])

export default router