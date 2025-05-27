// models/Category.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class UserAddress extends Model {
    
}

UserAddress.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    house_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'useraddress',
    underscored: true,
    timestamps: true
});

module.exports = UserAddress;