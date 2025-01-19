/**
 * 文件说明：错题路由
 * 功能：
 * - 错题相关接口路由
 * - 路由权限控制
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，配置错题路由
 */

const express = require('express')
const router = express.Router()
const questionController = require('../controllers/questionController')
const { protect } = require('../middleware/auth')

router.use(protect)

router
  .route('/')
  .post(questionController.createQuestion)

router
  .route('/notebook/:notebookId')
  .get(questionController.getQuestions)

router
  .route('/:id')
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion)

router
  .route('/analyze')
  .post(questionController.analyzeKnowledgePoints)

module.exports = router 