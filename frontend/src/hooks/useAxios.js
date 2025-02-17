import axios from 'axios'

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' }
  })

  return axiosInstance
}

export default useAxios