const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const gymOwners = require("./gym.Owner.model");
const gymSchedule = require("../model/gymSchedule.model");

const Gym = sequelize.define(
  "gyms",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "gymOwners",
        key: "id",
      },
    },
    business_type: {
      type: DataTypes.ENUM("direct", "franchise"),
      allowNull: false,
      defaultValue: "direct",
    },
    gym_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    gym_logo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gym_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gym_geo_location: {
      type: DataTypes.JSON,
      allowNull: false, // Making it required
      validate: {
        notNull: {
          msg: 'Gym location is required'
        },
        isValidLocation(value) {
          if (!value.latitude || !value.longitude) {
            throw new Error('Both latitude and longitude are required');
          }
          if (value.latitude < -90 || value.latitude > 90) {
            throw new Error('Invalid latitude');
          }
          if (value.longitude < -180 || value.longitude > 180) {
            throw new Error('Invalid longitude');
          }
        }
      }
    },
    facilities: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    msme_certificate_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    msme_certificate_photo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    shop_certificate: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    shop_certificate_photo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    about_us: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ratings: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gst_details: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bank_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancel_cheque: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Gyms",
    tableName: "gyms",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
// Gym.associate = (models) => {
//   if (models.gymOwners) {
//     Gym.belongsTo(models.gymOwners, {
//       foreignKey: { name: "owner_id", allowNull: false },
//       onDelete: "CASCADE",
//     });
//   }

//   if (models.gymSchedule) {
//     Gym.hasMany(models.gymSchedule, {
//       foreignKey: { name: "gym_id", allowNull: false },
//       onDelete: "CASCADE",
//     });
//   }
// };

// Validate hook to ensure arrays are serialized before validation
Gym.addHook("beforeValidate", (Gym, options) => {
  const fieldsToSerialize = ["facilities", "bank_details"];

  fieldsToSerialize.forEach((field) => {
    if (Array.isArray(Gym[field])) {
      Gym[field] = JSON.stringify(Gym[field]);
    }
  });
});

// Deserialize JSON strings into arrays after fetching
Gym.afterFind((Gym, options) => {
  if (Gym) {
    const fieldsToDeserialize = ["facilities", "bank_details"];

    fieldsToDeserialize.forEach((field) => {
      if (typeof Gym[field] === "string") {
        Gym[field] = JSON.parse(Gym[field]);
      }
    });
  }
});

// Define relationships
//gymSchedule.associate({ Gym });

module.exports = Gym;
