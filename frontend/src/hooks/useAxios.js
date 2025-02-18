import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  })

  return axiosInstance
}

export default useAxios