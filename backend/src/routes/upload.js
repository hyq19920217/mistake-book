/**
 * 文件说明：上传路由
 * 功能：
 * - 文件上传接口
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，配置上传路由
 */

const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.post('/image', 
  uploadController.uploadMiddleware,
  uploadController.uploadImage
)

module.exports = router 