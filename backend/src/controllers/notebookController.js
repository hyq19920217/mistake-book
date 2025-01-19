/**
 * 文件说明：错题本控制器
 * 功能：
 * - 错题本CRUD操作
 * - 错题本权限控制
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错题本基础功能
 */

const Notebook = require('../models/notebook')
const { catchAsync } = require('../utils/errorHandler')

// 创建错题本
exports.createNotebook = catchAsync(async (req, res) => {
  const notebook = await Notebook.create({
    ...req.body,
    userId: req.user._id
  })

  res.status(201).json({
    status: 'success',
    data: notebook
  })
})

// 获取用户的所有错题本
exports.getNotebooks = catchAsync(async (req, res) => {
  const notebooks = await Notebook.find({ userId: req.user._id })
    .sort('-updatedAt')

  res.status(200).json({
    status: 'success',
    data: notebooks
  })
})

// 获取单个错题本
exports.getNotebook = catchAsync(async (req, res) => {
  const notebook = await Notebook.findOne({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!notebook) {
    return res.status(404).json({
      status: 'error',
      message: '错题本不存在'
    })
  }

  res.status(200).json({
    status: 'success',
    data: notebook
  })
})

// 更新错题本
exports.updateNotebook = catchAsync(async (req, res) => {
  const notebook = await Notebook.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  if (!notebook) {
    return res.status(404).json({
      status: 'error',
      message: '错题本不存在'
    })
  }

  res.status(200).json({
    status: 'success',
    data: notebook
  })
})

// 删除错题本
exports.deleteNotebook = catchAsync(async (req, res) => {
  const notebook = await Notebook.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!notebook) {
    return res.status(404).json({
      status: 'error',
      message: '错题本不存在'
    })
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
}) 