const { DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

const Facebook = sequelize.define('Facebook', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    embadedCode: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    edate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: { 
        type: DataTypes.ENUM('scheduled', 'posted', 'failed'),
        allowNull: false,
        defaultValue: 'failed',
    },
    module_type: {  
        type: DataTypes.STRING,
        allowNull: true,
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pageId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'facebook_post',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Facebook;
