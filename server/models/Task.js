const Sequelize = require('sequelize')
const db = require('../config/database')

const Task = db.define('tasks', {
  task_id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  rater_id: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  date: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  correct_answer_3: {
    allowNUll: false,
    type: Sequelize.STRING,
  },
  correct_answer_5: {
    allowNUll: false,
    type: Sequelize.STRING,
  },
  rater_answer_3: {
    allowNUll: false,
    type: Sequelize.STRING,
  },
  rater_answer_5: {
    allowNUll: false,
    type: Sequelize.STRING,
  },
  agree_answers_3: {
    allowNUll: false,
    type: Sequelize.BOOLEAN,
  },
  agree_answers_5: {
    allowNUll: false,
    type: Sequelize.BOOLEAN,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
})

module.exports = Task