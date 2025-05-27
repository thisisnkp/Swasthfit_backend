const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const User = require("./user.model");

// Define the Trainer model
const Trainer = sequelize.define(
  "trainers",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    profile_photo: DataTypes.STRING,
    transformation_photos: DataTypes.STRING,
    address: DataTypes.TEXT,
    expertise: DataTypes.TEXT,
    experience: DataTypes.STRING,
    bank_account_no: DataTypes.STRING,
    ifsc_code: DataTypes.STRING,
    time_slot: DataTypes.TEXT("long"),
    client_details: DataTypes.STRING,
    client_bio: DataTypes.STRING,
    client_price: DataTypes.INTEGER,
    client_quote: DataTypes.INTEGER,
    client_qr_code: DataTypes.CHAR,
    marketing_suite_purchases: DataTypes.CHAR,
    ratings: DataTypes.CHAR,
    aadhar_details: DataTypes.CHAR,
    pan_details: DataTypes.CHAR,
    offer: DataTypes.CHAR,
    diet_and_workout_details: DataTypes.STRING,
    commission_earned: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "trainer",
    tableName: "trainers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define the associations
Trainer.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasOne(Trainer, {
  foreignKey: "user_id",
  as: "trainer",
});

module.exports = Trainer;
