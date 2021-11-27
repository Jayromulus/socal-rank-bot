const { DataTypes } = require('sequelize')
const { db } = require('../db')

module.exports = db.define('rank', {
  rank: DataTypes.INTEGER,
  player: DataTypes.STRING,
  score: DataTypes.INTEGER,
  month: DataTypes.STRING,
  year:DataTypes.INTEGER
})