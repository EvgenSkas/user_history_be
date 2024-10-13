// models/payment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const ProductPayment = require('./productPayment');

// Define Payment model
const Payment = sequelize.define('Payment', {
    orderid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    delivery: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deliveryPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
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

Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Payment belongs to a User
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' }); // A User can have many Payments
Product.belongsToMany(Payment, {
    through: ProductPayment,  // Junction model
    foreignKey: 'productId',  // Foreign key in ProductPayment table
    otherKey: 'paymentId',
    as: 'payments' // Alias for the relationship
});

Payment.belongsToMany(Product, {
    through: ProductPayment,  // Junction model
    foreignKey: 'paymentId',  // Foreign key in ProductPayment table
    otherKey: 'productId',
    as: 'products' // Alias for the relationship
});

module.exports = Payment;