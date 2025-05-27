const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Import Sequelize instance

const Payout = sequelize.define(
  "Payout",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT,  // Storing JSON as text
      allowNull: false,
    },
  },
  {
    modelName: "Payout",
    tableName: "id_payout",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Serialize JSON before saving (only if 'data' is stored as TEXT)
Payout.addHook("beforeValidate", (payout) => {
  if (typeof payout.data !== "string") {
    payout.data = JSON.stringify(payout.data);
  }
});

// Deserialize JSON after retrieving (only if 'data' is stored as TEXT)
Payout.addHook("afterFind", (result) => {
  if (result) {
    if (Array.isArray(result)) {
      result.forEach((instance) => {
        if (typeof instance.data === "string") {
          instance.data = JSON.parse(instance.data);
        }
      });
    } else if (typeof result.data === "string") {
      result.data = JSON.parse(result.data);
    }
  }
});

module.exports = Payout;

// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../../sequelize');

// const Payout = sequelize.define('Payout', {
//     id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         primaryKey: true
//     },
//     user_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     data: {
//         type: Sequelize.TEXT,
//         allowNull: false
//     }
// }, {
//     sequelize,
//     modelName: 'Payout',
//     tableName: 'id_payout',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   });

// Serialize JSON before saving (only if 'data' is stored as TEXT)
// Payout.addHook('beforeValidate', (payout) => {
//     if (typeof payout.data !== "string") {
//         payout.data = JSON.stringify(payout.data);
//     }
// });

// Deserialize JSON after retrieving (only if 'data' is stored as TEXT)
// Payout.addHook('afterFind', (result) => {
//     if (result) {
//         if (Array.isArray(result)) {
//             result.forEach((instance) => {
//                 if (typeof instance.data === "string") {
//                     instance.data = JSON.parse(instance.data);
//                 }
//             });
//         } else if (typeof result.data === "string") {
//             result.data = JSON.parse(result.data);
//         }
//     }
// });

// module.exports = {Payout};
