// models/index.js
const sequelize = require("../../../sequelize");
//const User = require('../../user/user.model');
const gymOwners = require("../model/gymOwners.model");
const Gym = require("../gym_owners/gym.model");
const GymSchedule = require("../model/gymSchedule.model");

// User.hasMany(Gym,{
//   foreignKey: 'user_id',
//   as: 'gym'
// });
gymOwners.hasMany(Gym, {
  foreignKey: "owner_id",
});

Gym.belongsTo(gymOwners, {
  foreignKey: "owner_id",
});

GymSchedule.belongsTo(Gym, {
  foreignKey: "gym_id",
});

module.exports = {
  sequelize,
  gymOwners,
  Gym,
  GymSchedule,
};

// models/index.js

// const fs = require("fs");
// const path = require("path");
// const Sequelize = require("sequelize");
// const sequelize = require("../../../sequelize"); // Your sequelize instance

// const db = {};

// // --- List of models to load ---
// // Add paths relative to this index.js file
// const modelsToLoad = [
//   // Existing models
//   { name: "GymMainOwner", path: "../model/gymOwners.model" }, // Assuming this is the model previously named 'gymOwners'
//   { name: "Gym", path: "../gym_owners/gym.model" },
//   { name: "GymSchedule", path: "../model/gymSchedule.model" },

//   // Role-based permission models
//   { name: "Module", path: "../role/models/Modules" }, // Path to your Module.js
//   { name: "Permission", path: "../role/models/Permission" }, // Path to your Permission.js
//   { name: "Role", path: "../role/models/Role" }, // Path to your Role.js
//   { name: "RolePermission", path: "../role/models/RolePermission" }, // Path to your RolePermission.js

//   // Staff model that has role_id (ensure correct path and exported model name)
//   // This is the model referred to as GymOwner in role.controller.js
//   { name: "GymOwner", path: "../gym_owners/gym.Owner.model" }, // Or Staff, GymStaff etc.
// ];

// modelsToLoad.forEach((modelInfo) => {
//   const model = require(modelInfo.path);
//   // If your models are not already initializing with sequelize, you might need:
//   // const modelInitialized = model(sequelize, Sequelize.DataTypes);
//   // db[modelInitialized.name] = modelInitialized;
//   // But if they are self-initializing like in your provided files, direct assignment is fine:
//   db[model.name] = model; // Assumes model file exports the Sequelize model class/object directly
//   // and model class has a 'name' property (e.g., Role.name is 'Role')
// });

// // Call associate methods on each model
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

// /*
// Make sure each of your model files (e.g., Role.js, Permission.js, etc.)
// correctly defines its associations within a static associate(models) method.

// Example: In your Role.js (../role/models/Role.js)
// // ...
// class Role extends Model {
//   static associate(models) {
//     Role.hasMany(models.RolePermission, {
//       foreignKey: "role_id",
//       as: "rolePermissions",
//     });
//     // Association to the Staff/GymOwner model that has role_id
//     Role.hasMany(models.GymOwner, { // Assuming the model name is GymOwner
//         foreignKey: 'role_id',
//         as: 'staffMembers'
//     });
//   }
// }
// // ...
// module.exports = Role;

// Example: In your GymOwner.js (../gym_owners/gym.Owner.model.js)
// // ...
// class GymOwner extends Model { // Or whatever it's named
//   static associate(models) {
//     GymOwner.belongsTo(models.Role, {
//       foreignKey: 'role_id',
//       as: 'role'
//     });
//     // ... other associations like belongsTo Gym if a staff member belongs to a specific gym directly
//   }
// }
// // ...
// module.exports = GymOwner;

// Example: Module.js (../role/models/Modules.js)
// // ...
// class Module extends Model {
//   static associate(models) {
//     Module.hasMany(models.Permission, {
//       foreignKey: "module_id",
//       as: "permissions",
//     });
//   }
// }
// // ...
// module.exports = Module;

// Example: Permission.js (../role/models/Permission.js)
// // ...
// class Permission extends Model {
//   static associate(models) {
//     Permission.belongsTo(models.Module, {
//       foreignKey: 'module_id',
//       as: 'module',
//     });
//     Permission.hasMany(models.RolePermission, {
//       foreignKey: 'permission_id',
//       as: 'rolePermissions',
//     });
//   }
// }
// // ...
// module.exports = Permission;

// Example: RolePermission.js (../role/models/RolePermission.js)
// // ...
// class RolePermission extends Model {
//   static associate(models) {
//     RolePermission.belongsTo(models.Role, {
//       foreignKey: "role_id",
//       as: "role",
//     });
//     RolePermission.belongsTo(models.Permission, {
//       foreignKey: "permission_id",
//       as: "permission",
//     });
//   }
// }
// // ...
// module.exports = RolePermission;

// */
