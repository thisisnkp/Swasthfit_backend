const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

const User = sequelize.define(
  'questions',
  {
    questions: { type: DataTypes.TEXT, allowNull: true },
    poss_ans: { type: DataTypes.TEXT, allowNull: true, },
    cat: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);


// Hooks
User.addHook('beforeValidate', (user, options) => {
  const fieldsToSerialize = ['poss_ans'];
  fieldsToSerialize.forEach(field => {
    if (Array.isArray(user[field])) {
      user[field] = JSON.stringify(user[field]);
    }
  });
});

User.addHook('afterFind', (result, options) => {
  const fieldsToDeserialize = ['poss_ans'];
  if (result) {
    if (Array.isArray(result)) {
      result.forEach(instance => {
        fieldsToDeserialize.forEach(field => {
          if (instance[field] && typeof instance[field] === 'string') {
            try {
              instance[field] = JSON.parse(instance[field]);
            } catch (err) {
              console.error(`Error deserializing field "${field}":`, err);
            }
          }
        });
      });
    } else {
      fieldsToDeserialize.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
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
