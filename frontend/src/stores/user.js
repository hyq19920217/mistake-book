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
import request from '../utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await request.post('/auth/login', { email, password })
        this.setUserData(res.data)
        return res
      } catch (error) {
        throw error
      }
    },

    async register(username, email, password) {
      try {
        const res = await request.post('/auth/register', {
          username,
          email,
          password
        })
        this.setUserData(res.data)
        return res
      } catch (error) {
        throw error
      }
    },

    setUserData(data) {
      this.token = data.token
      this.userInfo = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify(data.user))
    },

    logout() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.userInfo.username
  }
}) 