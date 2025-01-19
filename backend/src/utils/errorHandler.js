/**
 * 文件说明：错误处理工具
 * 功能：
 * - 统一错误处理
 * - 异步错误捕获
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错误处理功能
 */

// 捕获异步错误
exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

// 全局错误处理中间件
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
} 