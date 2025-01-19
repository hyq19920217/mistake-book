/**
 * 文件说明：错题控制器
 * 功能：
 * - 错题CRUD操作
 * - 错题权限控制
 * - OCR文本提取
 * - 知识点分析
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，实现错题基础功能
 */

const Question = require('../models/question')
const { catchAsync } = require('../utils/errorHandler')
const { AIService } = require('../services/aiService')

// 创建错题
exports.createQuestion = catchAsync(async (req, res) => {
  const question = await Question.create({
    ...req.body,
    userId: req.user._id
  })

  res.status(201).json({
    status: 'success',
    data: question
  })
})

// 获取错题本下的所有错题
exports.getQuestions = catchAsync(async (req, res) => {
  const questions = await Question.find({
    notebookId: req.params.notebookId,
    userId: req.user._id
  }).sort('-updatedAt')

  res.status(200).json({
    status: 'success',
    data: questions
  })
})

// 获取单个错题
exports.getQuestion = catchAsync(async (req, res) => {
  const question = await Question.findOne({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!question) {
    return res.status(404).json({
      status: 'error',
      message: '错题不存在'
    })
  }

  res.status(200).json({
    status: 'success',
    data: question
  })
})

// 更新错题
exports.updateQuestion = catchAsync(async (req, res) => {
  const question = await Question.findOneAndUpdate(
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

  if (!question) {
    return res.status(404).json({
      status: 'error',
      message: '错题不存在'
    })
  }

  res.status(200).json({
    status: 'success',
    data: question
  })
})

// 删除错题
exports.deleteQuestion = catchAsync(async (req, res) => {
  const question = await Question.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!question) {
    return res.status(404).json({
      status: 'error',
      message: '错题不存在'
    })
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
})

// 批量分析知识点
exports.analyzeKnowledgePoints = catchAsync(async (req, res) => {
  const { questionIds } = req.body

  // 获取题目内容
  const questions = await Question.find({
    _id: { $in: questionIds },
    userId: req.user._id
  })

  if (!questions.length) {
    return res.status(404).json({
      status: 'error',
      message: '未找到要分析的题目'
    })
  }

  // 调用AI服务分析知识点
  const analysisResult = await AIService.analyzeKnowledgePoints(questions)

  // 更新题目的知识点
  const updatePromises = analysisResult.results.map(async result => {
    await Question.findByIdAndUpdate(result.questionId, {
      knowledgePoints: result.knowledgePoints
    })
  })

  await Promise.all(updatePromises)

  res.status(200).json({
    status: 'success',
    data: analysisResult.results
  })
}) 