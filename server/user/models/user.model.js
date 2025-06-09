const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const User = sequelize.define(
  "users",
  {
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    user_weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    user_aadhar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_pan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_bank: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trainer_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_signup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_earned_coins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.associate = (models) => {
  if (models.UserFitData) {
    User.hasMany(models.UserFitData, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "CASCADE",
    });
  }

  if (models.Trainer) {
    User.hasMany(models.Trainer, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "CASCADE",
    });
  }

  if (models.UserDetails) {
    User.hasOne(models.UserDetails, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "CASCADE",
      as: "user_details",
    });
  }
};

module.exports = User;
