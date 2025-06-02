const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const FoodSubCategory = require("../models/FoodSubCategory")
class Commission extends Model {
    static associate(models) {
        this.belongsTo(models.FoodSubCategory, {
            foreignKey: 'applied_id',
            as: 'subCategory',
            constraints: false,
            onDelete: 'CASCADE'
        });
    }
    
}

Commission.init(
    {
      fixed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('percentage', 'flat'),
        allowNull: false,
        defaultValue: 'percentage',
      },
      applies_to: {
        type: DataTypes.ENUM('subcategory', 'category', 'restaurant'),
        allowNull: false,
      },
      applied_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "Commission",
      tableName: "commissions",
      underscored: true,
      timestamps: false,
    }
  );
  
  module.exports = Commission;