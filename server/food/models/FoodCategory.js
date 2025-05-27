// models/Category.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

class FoodCategory extends Model {
  static associate(models) {
    this.hasMany(models.FoodItem, {
      foreignKey: "category_id",
      as: "foodItems",
    });
  }
}

FoodCategory.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      ),
    },
  },
  {
    sequelize,
    modelName: "FoodCategory",
    tableName: "foodcategories",
    underscored: true,
    timestamps: true,
  },
);

module.exports = FoodCategory;
