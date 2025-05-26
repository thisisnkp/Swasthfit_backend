const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const GymAbout = sequelize.define(
  "gym_about",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gym_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gym_owner_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "gym_owners", // This should match your gym owners table name
        key: "id",
      },
    },
    gym_profile_picture: DataTypes.STRING,
    gym_cover_image: DataTypes.STRING,
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    about_us: DataTypes.TEXT,
    services: DataTypes.TEXT,
    gym_contect_mobile: DataTypes.BIGINT,
    gym_contect_alt_mobile: DataTypes.BIGINT,
    gym_contect_email_id: DataTypes.STRING,
    manager_contect_mobile: DataTypes.BIGINT,
    manager_contect_alt_mobile: DataTypes.BIGINT,
    manager_contect_email_id: DataTypes.STRING,
    days_of_week: DataTypes.JSON,
    sessions_1: DataTypes.STRING,
    sessions_2: DataTypes.STRING,
    sessions_3: DataTypes.STRING,
    gym_address: DataTypes.STRING,
    gym_location: {
      type: DataTypes.GEOMETRY("POINT", 4326), // 4326 is the SRID for WGS84 (standard GPS coordinates)
      allowNull: true,
    },
    community: DataTypes.TEXT,
    marketing: DataTypes.TEXT,
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
    tableName: "gym_about",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = GymAbout;
