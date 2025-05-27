// models/index.js
const sequelize = require('../../../sequelize');
//const User = require('../../user/user.model');
const gymOwners = require('../model/gymOwners.model');
const Gym = require('../gym_owners/gym.model');
const GymSchedule = require('../model/gymSchedule.model');


// User.hasMany(Gym,{
//   foreignKey: 'user_id',
//   as: 'gym'
// });
gymOwners.hasMany(Gym,{
  foreignKey:'owner_id'
});

Gym.belongsTo(gymOwners,{
  foreignKey:'owner_id'
});

GymSchedule.belongsTo(Gym,{
  foreignKey:'gym_id'
});

module.exports = {
  sequelize,
  gymOwners,
  Gym,
  GymSchedule
}
