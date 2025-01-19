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

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  analysis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  knowledgePoints: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  notebookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'notebooks',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
});

module.exports = Question; 