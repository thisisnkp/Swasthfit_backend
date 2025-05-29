const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize'); // adjust your sequelize instance import

class Rider extends Model {}

Rider.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  date_of_birth: {
    type: DataTypes.DATE,
  },
  home_location_name: {
    type: DataTypes.STRING,
  },
  home_latitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
  home_longitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
  aadhar_number: {
    type: DataTypes.STRING(12),
  },
  type_of_rider: {
    type: DataTypes.INTEGER,
  },
  owner_id: {
    type: DataTypes.INTEGER,
  },
  rider_tags: {
    type: DataTypes.JSON, // nullable field
  },
  on_task: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  current_latitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
  current_longitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
}, {
  sequelize,
  modelName: 'Rider',
  tableName: 'riders',
  timestamps: false, // set true if you want createdAt, updatedAt
});

module.exports = Rider;
