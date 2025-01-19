/**
 * 文件说明：错题本路由
 * 功能：
 * - 错题本相关接口路由
 * - 路由权限控制
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，配置错题本路由
 */

const express = require('express')
const router = express.Router()
const notebookController = require('../controllers/notebookController')
const { protect } = require('../middleware/auth')

router.use(protect) // 所有错题本路由都需要认证

router
  .route('/')
  .get(notebookController.getNotebooks)
  .post(notebookController.createNotebook)

router
  .route('/:id')
  .get(notebookController.getNotebook)
  .patch(notebookController.updateNotebook)
  .delete(notebookController.deleteNotebook)

module.exports = router 