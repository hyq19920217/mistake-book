const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { catchAsync } = require('../utils/errorHandler')

// 生成JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body

  // 检查用户是否已存在
  const existingUser = await User.findOne({ $or: [{ email }, { username }] })
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: '用户名或邮箱已被注册'
    })
  }

  // 创建新用户
  const user = await User.create({
    username,
    email,
    password
  })

  // 生成token
  const token = generateToken(user._id)

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }
  })
})

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body

  // 检查用户是否存在
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      status: 'error',
      message: '邮箱或密码错误'
    })
  }

  // 生成token
  const token = generateToken(user._id)

  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }
  })
}) 