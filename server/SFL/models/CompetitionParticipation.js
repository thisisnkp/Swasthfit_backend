const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const CompetitionParticipation = sequelize.define(
  "CompetitionParticipation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    competition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_winner: {
      type: DataTypes.ENUM("yes", "no"),
      defaultValue: "no",
    },
    entry_coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coins_earned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "competition_participations",
    timestamps: false,
  }
);

module.exports = CompetitionParticipation;
