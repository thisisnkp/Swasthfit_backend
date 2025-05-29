'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class FavoriteItems extends Model {

}

FavoriteItems.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Foodfavoriteitems',
    tableName: 'foodfavoriteitems',
    underscored: true,
    timestamps: false
});

module.exports = FavoriteItems;