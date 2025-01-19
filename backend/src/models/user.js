/**
 * 文件说明：用户模型
 * 功能：
 * - 定义用户数据结构
 * - 密码加密
 * - 密码验证
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，定义基础用户模型
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符'],
    select: false // 查询时默认不返回密码
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// 保存前加密密码
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// 验证密码
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema) 