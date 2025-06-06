const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const FoodOrders = require("../food/models/foodOrder")
class User extends Model {}

User.init(
  {
    trainer_id: { type: DataTypes.INTEGER, allowNull: false },
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
    password: { 
      type: DataTypes.STRING,
      allowNull: false // <-- Is line ki wajah se password compulsory hai
    }
,    
    user_pan: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: { len: [10, 10] },
    },
    user_address: { type: DataTypes.TEXT, allowNull: true },
    user_earned_coins: { type: DataTypes.INTEGER, defaultValue: 0 },
    user_gullak_money_earned: { type: DataTypes.INTEGER, defaultValue: 0 },
    user_gullak_money_used: { type: DataTypes.INTEGER, defaultValue: 0 },
    user_competitions: { type: DataTypes.STRING(255), allowNull: true },
    user_type: { type: DataTypes.STRING(255), allowNull: true },
    user_social_media_id: { type: DataTypes.STRING(255), allowNull: true },
    user_downloads: { type: DataTypes.INTEGER, allowNull: true },
    user_ratings: { type: DataTypes.STRING(255), allowNull: true },
    user_qr_code: { type: DataTypes.STRING(255), allowNull: true },
    is_signup: { type: DataTypes.BOOLEAN, defaultValue: true },
    otpless_token: { type: DataTypes.STRING(100), unique: true, allowNull: true },
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



User.addHook("afterCreate", async (user, options) => {
  if (user.user_type === "owner") {
    try {
      await Vendor.create({
        user_id: user.id, // linking vendor to user
        name: user.user_name,
        email: user.user_email,
        phone: user.user_mobile,
        password: user.password, // ya aap alag password bhi set kar sakte ho
        vendorType: "restaurant", // ya default jo bhi aapka logic ho
      });
      console.log(`Vendor created for user ID: ${user.id}`);
    } catch (error) {
      console.error("Error creating Vendor:", error);
    }
  }
});

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
