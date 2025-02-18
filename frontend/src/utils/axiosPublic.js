import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export default axiosPublic