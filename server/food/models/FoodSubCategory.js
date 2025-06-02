const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const Commission = require("../models/Comission");
const FoodCategory = require("../models/FoodCategory");
class FoodSubCategory extends Model {
  static associate(models) {
    this.hasOne(models.Commission, {
      foreignKey: "applied_id",
      as: "commission",
      constraints: false,
      scope: {
        applies_to: "subcategory",
      },
      onDelete: "CASCADE",
    });
  }
}

FoodSubCategory.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commission: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0,
    },
    created_by: {
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
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "FoodSubCategory",
    tableName: "foodsubcategories",
    underscored: true,
    timestamps: true,
  },
);

FoodSubCategory.belongsTo(FoodCategory, {
  foreignKey: "category_id",
  as: "category",
  onDelete: "CASCADE",
});

FoodCategory.hasMany(FoodSubCategory, {
  foreignKey: "category_id",
  as: "subcategories",
  onDelete: "CASCADE",
});

module.exports = FoodSubCategory;
