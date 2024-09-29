// models/payment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');  // Import the User model

// Define Payment model
const Payment = sequelize.define('Payment', {
    sys: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    systranid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
    },
}, {
    tableName: 'payments',
    timestamps: true,
});

// Define relationships
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Payment belongs to a User
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' }); // A User can have many Payments

module.exports = Payment;