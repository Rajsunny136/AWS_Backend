const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Import the sequelize instance

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true, // Allow null for cases like OAuth users
        },
        gender: {
            type: DataTypes.STRING(1),
            allowNull: true, // Optional field
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Default value for active
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default value for is_deleted
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'New User Registered', // Default value for title
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user', // Default value for type
        },
    },
    {
        timestamps: true, // Enable createdAt and updatedAt
        tableName: 'User_tbl', // Define the table name
        indexes: [
            {
                unique: true,
                name: 'userId_index',
                fields: ['id'], // Index on the id field
            },
        ],
    }
);

module.exports = User;
