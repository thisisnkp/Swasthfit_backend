const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class RestaurantStockReport extends Model {}

RestaurantStockReport.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity_in_stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reorder_level: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_restocked_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'RestaurantStockReport',
  tableName: 'restaurant_stock_reports',
  timestamps: false,
});

module.exports = RestaurantStockReport;
