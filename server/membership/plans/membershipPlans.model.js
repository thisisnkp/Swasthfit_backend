const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
module.exports = (sequelize, DataTypes) => {
    const MembershipPlanGym = sequelize.define('MembershipPlan', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      createdBy: {
        type: DataTypes.ENUM,
        values: ['admin', 'gym'],
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM,
        values: ['gym', 'trainer', 'ai', 'diet-workout', 'brain-games', 'go-social', 'gym-buddy', 'fitbee'],
        allowNull: false
      },
      gymId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      features: {
        type: DataTypes.JSON,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      membershipType: {
        type: DataTypes.ENUM,
        values: ['monthly', 'quarterly', 'semi-annual', 'annual'],
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'membershipPlans',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return MembershipPlanGym;
  };
  