const { DataTypes } = require('sequelize')
const { db } = require('../db')

module.exports = db.define('team', {
  cb: DataTypes.STRING,
  bossName: DataTypes.STRING,
  lapNumber: DataTypes.INTEGER,
  damage: DataTypes.INTEGER,
  member: DataTypes.STRING,
  enraged: DataTypes.BOOLEAN,
  overkill: {
    type: DataTypes.BOOLEAN,
    default: false
  },
  auto: {
    type: DataTypes.STRING,
    defaultValue: 'Manual'
  },
  proxy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  character1Name: DataTypes.STRING,
  character1Stars: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 6
    }
  },
  character1Rank: DataTypes.STRING,
  character1UE: DataTypes.BOOLEAN,
  character1Borrowed: DataTypes.BOOLEAN,
  character1Owner: DataTypes.STRING,

  character2Name: DataTypes.STRING,
  character2Stars: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 6
    }
  },
  character2Rank: DataTypes.STRING,
  character2UE: DataTypes.BOOLEAN,
  character2Borrowed: DataTypes.BOOLEAN,
  character2Owner: DataTypes.STRING,

  character3Name: DataTypes.STRING,
  character3Stars: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 6
    }
  },
  character3Rank: DataTypes.STRING,
  character3UE: DataTypes.BOOLEAN,
  character3Borrowed: DataTypes.BOOLEAN,
  character3Owner: DataTypes.STRING,

  character4Name: DataTypes.STRING,
  character4Stars: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 6
    }
  },
  character4Rank: DataTypes.STRING,
  character4UE: DataTypes.BOOLEAN,
  character4Borrowed: DataTypes.BOOLEAN,
  character4Owner: DataTypes.STRING,

  character5Name: DataTypes.STRING,
  character5Stars: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 6
    }
  },
  character5Rank: DataTypes.STRING,
  character5UE: DataTypes.BOOLEAN,
  character5Borrowed: DataTypes.BOOLEAN,
  character5Owner: DataTypes.STRING,
  notes: DataTypes.STRING
})