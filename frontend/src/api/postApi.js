import { axiosPrivate } from '../utils/axios'

export const getFeedPosts = async () => {
  try {
    const response = await axiosPrivate.post('/posts/feed')
    return response.data
  } catch (err) {
    console.error('API error:', err)
    throw err
  }
}