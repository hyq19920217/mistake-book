/**
 * 文件说明：axios请求配置
 * 功能：
 * - 配置axios实例
 * - 请求拦截器
 * - 响应拦截器
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，配置axios
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    ElMessage.error(error.response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request 