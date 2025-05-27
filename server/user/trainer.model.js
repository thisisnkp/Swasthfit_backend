const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const User = require("./user.model");

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
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    profile_photo: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "Path to profile photo uploaded via multer",
    },
    transformation_photos: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("transformation_photos");
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (error) {
          console.error("Error parsing transformation_photos:", error);
          return []; // Return an empty array if parsing fails
        }
      },
      set(value) {
        this.setDataValue("transformation_photos", JSON.stringify(value));
      },
      comment: "Array of paths to transformation photos uploaded via multer",
    },
    address: DataTypes.TEXT,
    expertise: DataTypes.TEXT,
    experience: DataTypes.STRING,
    bank_account_no: DataTypes.STRING,
    ifsc_code: DataTypes.STRING,
    days: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("days");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("days", JSON.stringify(value));
      },
      comment: "Days trainer is available, e.g., monday,tuesday,friday",
    },

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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Trainer.associate = (models) => {
  // Trainer.belongsTo(models.User, {
  //   foreignKey: "user_id",
  //   as: "user",
  // });
};

module.exports = Trainer;
