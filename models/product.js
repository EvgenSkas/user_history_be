// models/product.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Payment = require('./payment'); 
const ProductPayment = require('./productPayment');

// Define Product model
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    portion: {
        type: DataTypes.INTEGER,
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
    tableName: 'products',
    timestamps: true,
});

module.exports = Product;