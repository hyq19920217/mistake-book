/**
 * 文件说明：错题本状态管理
 * 功能：
 * - 错题本列表管理
 * - 错题本CRUD操作
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错题本状态管理
 */

import { defineStore } from 'pinia'
import request from '../utils/request'

export const useNotebookStore = defineStore('notebook', {
  state: () => ({
    notebooks: [],
    currentNotebook: null,
    loading: false
  }),

  actions: {
    async fetchNotebooks() {
      this.loading = true
      try {
        const res = await request.get('/notebooks')
        this.notebooks = res.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createNotebook(data) {
      const res = await request.post('/notebooks', data)
      this.notebooks.unshift(res.data)
      return res.data
    },

    async updateNotebook(id, data) {
      const res = await request.patch(`/notebooks/${id}`, data)
      const index = this.notebooks.findIndex(n => n._id === id)
      if (index !== -1) {
        this.notebooks[index] = res.data
      }
      return res.data
    },

    async deleteNotebook(id) {
      await request.delete(`/notebooks/${id}`)
      const index = this.notebooks.findIndex(n => n._id === id)
      if (index !== -1) {
        this.notebooks.splice(index, 1)
      }
    },

    setCurrentNotebook(notebook) {
      this.currentNotebook = notebook
    }
  }
}) 