/**
 * 文件说明：认证中间件
 * 功能：
 * - 验证JWT token
 * - 保护需要认证的路由
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现JWT验证
 */

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { catchAsync } = require('../utils/errorHandler')

exports.protect = catchAsync(async (req, res, next) => {
  // 获取token
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: '请先登录'
    })
  }

  // 验证token
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // 检查用户是否仍然存在
  const user = await User.findById(decoded.id)
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: '用户不存在'
    })
  }

  // 将用户信息添加到请求对象
  req.user = user
  next()
}) 