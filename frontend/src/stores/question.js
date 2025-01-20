/**
 * 文件说明：错题状态管理
 * 功能：
 * - 错题列表管理
 * - 错题CRUD操作
 * - 知识点分析
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错题状态管理
 */

import { defineStore } from 'pinia'
import { request } from '../utils/request'

export const useQuestionStore = defineStore('question', {
  state: () => ({
    questions: [],
    currentQuestion: null,
    loading: false,
    analyzing: false
  }),

  actions: {
    async fetchQuestions(notebookId) {
      this.loading = true
      try {
        const res = await request.get(`/questions/notebook/${notebookId}`)
        this.questions = res.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createQuestion(data) {
      const res = await request.post('/questions', data)
      this.questions.unshift(res.data)
      return res.data
    },

    async updateQuestion(id, data) {
      const res = await request.patch(`/questions/${id}`, data)
      const index = this.questions.findIndex(q => q._id === id)
      if (index !== -1) {
        this.questions[index] = res.data
      }
      return res.data
    },

    async deleteQuestion(id) {
      await request.delete(`/questions/${id}`)
      const index = this.questions.findIndex(q => q._id === id)
      if (index !== -1) {
        this.questions.splice(index, 1)
      }
    },

    async analyzeKnowledgePoints(questionIds) {
      this.analyzing = true
      try {
        const res = await request.post('/questions/analyze', { questionIds })
        // 更新题目的知识点
        res.data.forEach(result => {
          const question = this.questions.find(q => q._id === result.questionId)
          if (question) {
            question.knowledgePoints = result.knowledgePoints
          }
        })
        return res.data
      } catch (error) {
        throw error
      } finally {
        this.analyzing = false
      }
    },

    setCurrentQuestion(question) {
      this.currentQuestion = question
    }
  }
}) 