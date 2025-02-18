import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

// creates axiosInstance without credentials for use by authApi calls
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// creates axiosInstance with credentials for use by all other api calls
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})