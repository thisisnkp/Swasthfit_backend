const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
// const Gym = require('../gym/gym.model');
const Membership = require("../membership/membership/membership.model");

const User = sequelize.define(
  "user",
  {
    trainer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_name: { type: DataTypes.STRING, allowNull: false },
    user_mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
      validate: { isNumeric: true, len: [10, 15] },
    },
    user_dob: { type: DataTypes.DATE, allowNull: true },
    user_age: { type: DataTypes.INTEGER, allowNull: true },
    user_gender: { type: DataTypes.STRING(255), allowNull: true },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    user_bank: { type: DataTypes.TEXT, allowNull: true },
    user_height: { type: DataTypes.INTEGER, allowNull: true },
    user_weight: { type: DataTypes.INTEGER, allowNull: true },
    user_aadhar: {
      type: DataTypes.STRING(16),
      allowNull: true,
      validate: { len: [12, 16] },
    },
    user_pan: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: { len: [10, 10] },
    },
    user_address: { type: DataTypes.TEXT, allowNull: true },
    user_earned_coins: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    user_gullak_money_earned: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    user_gullak_money_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    user_competitions: { type: DataTypes.STRING(255), allowNull: true },
    user_type: { type: DataTypes.STRING(255), allowNull: true },
    user_social_media_id: { type: DataTypes.STRING(255), allowNull: true },
    user_downloads: { type: DataTypes.INTEGER, allowNull: true },
    user_ratings: { type: DataTypes.STRING(255), allowNull: true },
    user_qr_code: { type: DataTypes.STRING(255), allowNull: true },
    is_signup: { type: DataTypes.BOOLEAN, defaultValue: true },
    otpless_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

console.log("MODELS", sequelize.models);


// Define relationships
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
};

// Hooks
User.addHook("beforeValidate", (user, options) => {
  const fieldsToSerialize = ["user_bank"];
  fieldsToSerialize.forEach((field) => {
    if (Array.isArray(user[field])) {
      user[field] = JSON.stringify(user[field]);
    }
  });
});

User.addHook("afterFind", (result, options) => {
  const fieldsToDeserialize = ["user_bank"];
  if (result) {
    if (Array.isArray(result)) {
      result.forEach((instance) => {
        fieldsToDeserialize.forEach((field) => {
          if (instance[field] && typeof instance[field] === "string") {
            try {
              instance[field] = JSON.parse(instance[field]);
            } catch (err) {
              console.error(`Error deserializing field "${field}":`, err);
            }
          }
        });
      });
    } else {
      fieldsToDeserialize.forEach((field) => {
        if (result[field] && typeof result[field] === "string") {
          try {
            result[field] = JSON.parse(result[field]);
          } catch (err) {
            console.error(`Error deserializing field "${field}":`, err);
          }
        }
      });
    }
  }
});

module.exports = User;
