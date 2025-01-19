/**
 * 文件说明：错误处理中间件
 * 功能：
 * - 统一错误处理
 * - 异步错误捕获
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错误处理功能
 */

// 捕获异步错误的高阶函数
const catchAsync = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // 默认错误状态码和消息
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = {
  catchAsync,
  errorHandler
}; 