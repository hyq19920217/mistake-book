/**
 * 文件说明：错题模型
 * 功能：
 * - 定义错题数据结构
 * - 关联错题本
 * - 存储题目内容、图片和知识点
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，定义错题模型
 */

const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  notebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, '题目内容不能为空'],
    trim: true
  },
  images: [{
    url: String,
    description: String
  }],
  analysis: {
    type: String,
    trim: true
  },
  knowledgePoints: [{
    level1: String,
    level2: String,
    level3: String
  }],
  ocrText: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
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
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Question', questionSchema) 