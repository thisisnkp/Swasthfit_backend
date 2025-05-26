const { DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

const Instagram = sequelize.define('Instagram', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "instagram", 
  },
  embadedCode: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  edate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'instagram_post',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

console.log("MODELS", sequelize.models);

module.exports = Instagram;