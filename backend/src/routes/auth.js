/**
 * 文件说明：认证路由
 * 功能：
 * - 注册路由
 * - 登录路由
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，配置认证路由
 */

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { catchAsync } = require('../middleware/errorHandler')

// 临时用户存储（后续会替换为数据库）
const users = []

// 注册路由
router.post('/register', catchAsync(async (req, res) => {
  const { username, password } = req.body

  // 检查用户是否已存在
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: '用户名已存在' })
  }

  // 加密密码
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // 创建新用户
  const user = {
    id: users.length + 1,
    username,
    password: hashedPassword
  }
  users.push(user)

  // 生成 JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.status(201).json({
    message: '注册成功',
    token,
    user: {
      id: user.id,
      username: user.username
    }
  })
}))

// 登录路由
router.post('/login', catchAsync(async (req, res) => {
  const { username, password } = req.body

  // 查找用户
  const user = users.find(u => u.username === username)
  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  // 验证密码
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  // 生成 JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.json({
    message: '登录成功',
    token,
    user: {
      id: user.id,
      username: user.username
    }
  })
}))

module.exports = router 