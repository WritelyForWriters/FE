import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const authInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
})

export default authInstance
