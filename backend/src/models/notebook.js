/**
 * 文件说明：错题本模型
 * 功能：
 * - 定义错题本数据结构
 * - 关联用户和错题
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，定义错题本模型
 */

const mongoose = require('mongoose')

const notebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '错题本名称不能为空'],
    trim: true,
    maxlength: [50, '错题本名称不能超过50个字符']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, '描述不能超过200个字符']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// 更新时自动更新updatedAt字段
notebookSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Notebook', notebookSchema) 