const { DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");

const MembershipService = sequelize.define(
  "MembershipService",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "memberships_services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Model for current_user_subscription table
const CurrentUserSubscription = sequelize.define(
  "CurrentUserSubscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plans: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    starting_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ending_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "current_user_subscription",
    timestamps: false,
  }
);

// Model for user_subscription_history table
const UserSubscriptionHistory = sequelize.define(
  "UserSubscriptionHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plans: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    starting_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ending_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "user_subscription_history",
    timestamps: false,
  }
);

module.exports = {
  MembershipService,
  CurrentUserSubscription,
  UserSubscriptionHistory,
};
