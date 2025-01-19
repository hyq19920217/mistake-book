const sequelize = require('../config/database');
const User = require('./user');
const Notebook = require('./notebook');
const Question = require('./question');

// 定义模型关联
User.hasMany(Notebook, { foreignKey: 'userId' });
Notebook.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Question, { foreignKey: 'userId' });
Question.belongsTo(User, { foreignKey: 'userId' });

Notebook.hasMany(Question, { foreignKey: 'notebookId' });
Question.belongsTo(Notebook, { foreignKey: 'notebookId' });

// 同步数据库
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步所有模型
    await sequelize.sync({ alter: true });
    console.log('数据库模型同步成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  User,
  Notebook,
  Question,
  initDatabase
}; 