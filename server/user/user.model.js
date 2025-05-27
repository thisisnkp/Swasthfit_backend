const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
// const Gym = require('../gym/gym.model');
const Membership = require("../membership/membership/membership.model");

const User = sequelize.define(
  "user",
  {
    trainer_id: {
      type: DataTypes.JSON,
      // allowNull: false,
      allowNull: true,
      defaultValue: [],
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
    user_bank: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('user_bank');
        if (!rawValue) return null;
        // Handle both string and JSON cases
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          return rawValue; // Return as-is if it's not JSON
        }
      },
      set(value) {
        if (typeof value === 'object') {
          this.setDataValue('user_bank', JSON.stringify(value));
        } else {
          this.setDataValue('user_bank', value);
        }
      }
    },
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
              // Only try to parse if it looks like JSON
              if (instance[field].startsWith('{') || instance[field].startsWith('[')) {
                instance[field] = JSON.parse(instance[field]);
              }
              // Otherwise keep the string value as-is
            } catch (err) {
              // Keep the original string value if parsing fails
              console.log(`Field "${field}" contains non-JSON string value:`, instance[field]);
            }
          }
        });
      });
    } else {
      fieldsToDeserialize.forEach((field) => {
        if (result[field] && typeof result[field] === "string") {
          try {
            // Only try to parse if it looks like JSON
            if (result[field].startsWith('{') || result[field].startsWith('[')) {
              result[field] = JSON.parse(result[field]);
            }
            // Otherwise keep the string value as-is
          } catch (err) {
            // Keep the original string value if parsing fails
            console.log(`Field "${field}" contains non-JSON string value:`, result[field]);
          }
        }
      });
    }
  }
});

module.exports = User;
