const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const User = require("./user.model");

// Define the UserFitData model
const Trainer = sequelize.define(
  "trainers",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Ensure this matches the table name in the database
        key: "id",
      },
      onDelete: "CASCADE", // Ensure referential integrity
      onUpdate: "CASCADE", // Ensure referential integrity
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
    trainerType: {
      type: DataTypes.ENUM("trainer", "dietitian"),
      allowNull: false,
    },
    // Removed password field as it is not present in the database and not needed here
  },
  {
    sequelize,
    modelName: "trainer",
    tableName: "trainers",
    timestamps: true, // Enables createdAt and updatedAt fields
    createdAt: "created_at", // Custom column name for createdAt
    updatedAt: "updated_at", // Custom column name for updatedAt
  }
);

Trainer.associate = (models) => {
  // Trainer.belongsTo(models.User, {
  //   foreignKey: "user_id",
  //   as: "user",
  // });
};

module.exports = Trainer;
