/**
 * 文件说明：用户状态管理
 * 功能：
 * - 用户登录状态管理
 * - 用户信息管理
 * - Token管理
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现用户状态管理
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { request } from '../utils/request'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)
  const isLoggedIn = ref(!!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isLoggedIn.value = true
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const login = async (credentials) => {
    try {
      const { data } = await request.post('/auth/login', credentials)
      setToken(data.token)
      setUser(data.user)
    } catch (error) {
      throw new Error(error.response?.data?.message || '登录失败')
    }
  }

  const register = async (userData) => {
    try {
      const { data } = await request.post('/auth/register', userData)
      setToken(data.token)
      setUser(data.user)
    } catch (error) {
      throw new Error(error.response?.data?.message || '注册失败')
    }
  }

  const logout = () => {
    token.value = ''
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }

  const fetchUserInfo = async () => {
    if (!token.value) return
    
    try {
      const { data } = await request.get('/auth/me')
      setUser(data)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    logout,
    fetchUserInfo
  }
}) 