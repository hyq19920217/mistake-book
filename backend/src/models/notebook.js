/**
 * 文件说明：错题本模型
 * 功能：
 * - 定义错题本数据结构
 * - 关联用户和错题
 * 
 * 更新记录：
 * 2024-03-xx：创建文件，定义错题本模型
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notebook = sequelize.define('Notebook', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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

module.exports = Notebook; 