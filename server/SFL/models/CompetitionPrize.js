const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const CompetitionPrize = sequelize.define(
  "CompetitionPrize",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    competition_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    prize: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    qualifying_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    no_of_claims: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    claimed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "competition_prizes",
    timestamps: false,
  }
);

module.exports = CompetitionPrize;
