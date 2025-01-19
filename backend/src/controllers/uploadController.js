/**
 * 文件说明：文件上传控制器
 * 功能：
 * - 图片上传
 * - OCR文字识别
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现文件上传和OCR功能
 */

const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { catchAsync } = require('../utils/errorHandler')
const { BaiduOCR } = require('../services/ocrService')

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('只支持jpg/jpeg/png格式的图片'))
    }
  }
})

// 上传图片
exports.uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: '请选择要上传的图片'
    })
  }

  const imageUrl = `/uploads/${req.file.filename}`
  
  // 调用OCR服务识别文字
  let ocrResult = null
  try {
    ocrResult = await BaiduOCR.recognize(req.file.path)
  } catch (error) {
    console.error('OCR识别失败:', error)
  }

  res.status(200).json({
    status: 'success',
    data: {
      url: imageUrl,
      ocrText: ocrResult?.text || ''
    }
  })
})

exports.uploadMiddleware = upload.single('image') 