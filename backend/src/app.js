/**
 * 文件说明：后端应用主入口文件
 * 功能：
 * - 配置Express应用
 * - 连接数据库
 * - 注册中间件
 * - 配置路由
 * - 错误处理
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，完成基础配置
 */

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
app.use('/uploads', express.static('uploads'))

// 数据库连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('数据库连接失败:', err))

// 注册路由 - 目前只启用认证路由
app.use('/api/auth', require('./routes/auth'))

// 错误处理中间件
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
}) 