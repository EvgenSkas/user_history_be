const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductPayment = sequelize.define('ProductPayment', {
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products', // Reference to the Product table
            key: 'id',
        },
    },
    paymentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'payments', // Reference to the Payment table
            key: 'id',
        },
    },
}, {
    tableName: 'product_payments',
    timestamps: false, // You can enable timestamps if you want created_at/updated_at
});

module.exports = ProductPayment;