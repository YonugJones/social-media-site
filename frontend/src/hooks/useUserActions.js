// custom hook for performing API calls and returning the updated user to the calling component.
import useAxiosPrivate from './useAxiosPrivate'
import { handleApiError } from '../api/apiHelper'

const useUserActions = () => {
  const axiosPrivate = useAxiosPrivate()

  const editUserProfile = async (userId, userData) => {
    try {
      const response = await axiosPrivate.put(`/users/${userId}`, userData)
      return response.data.data
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  const deleteUserProfile = async (userId) => {
    try {
      await axiosPrivate.delete(`/users/${userId}`)
      return userId
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  return { editUserProfile, deleteUserProfile }
}

export default useUserActions