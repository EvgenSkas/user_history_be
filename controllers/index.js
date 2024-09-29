const db = require('../models');
const logger = require('../logger');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.status(200).json(users);
    } catch (error) {
        logger.error(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await db.Payment.findAll();
        res.status(200).json(payments);
    } catch (error) {
        logger.error(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await db.Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        logger.error(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserPayments = async (req, res) => {
    try {
        const { Email } = req.query;

        if (!Email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find the user by email and include their payments and associated products
        const user = await db.User.findOne({
            where: { Email },
            include: [{
                model: db.Payment,
                as: 'payments',
                include: [{
                    model: db.Product, // Assuming the model is named Product
                    as: 'products'     // Make sure the alias is correct based on your association
                }]
            }]
        });

        if (!user) {
            const error = 'User not found';
            logger.error(`Error occurred: ${error}`);
            return res.status(404).json({ error });
        }

        // Convert the Sequelize object to a plain JavaScript object
        const userWithPayments = user.toJSON();

        // Send the response as a plain JSON object
        res.status(200).json(userWithPayments);
    } catch (error) {
        logger.error(`Error occurred: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

exports.registerPayment = async (req, res) => {
    console.log('req.body', req.body)
    logger.info((`NEW USER: ${req.body.Email}`))
    if (!req.body.Email) {
        res.status(201).json({ message: 'Payment, user, and product created/updated successfully' });
        return
    }
    try {
        const { Name, Email, Phone, Address, city, country, postcode, region, payment } = req.body;

        // 1. Check if the user exists by email
        let user = await db.User.findOne({ where: { Email: Email } });

        if (!user) {
            // If user doesn't exist, create a new user
            user = await db.User.create({
                Name,
                Email,
                Phone,
                Address,
                city,
                country,
                postcode,
                region
            });
        } else {
            user.update({
                Name,
                Email,
                Phone,
                Address,
                city,
                country,
                postcode,
                region
            });
        }

        const { sys, systranid, orderid, products, amount } = payment;

        const paymentRecord = await db.Payment.create({
            sys,
            systranid,
            orderid,
            amount,
            userId: user.id
        });

        for (const product of products) {
            const { name, quantity, amount, price, sku, unit, portion } = product;

            let productRecord = await db.Product.findOne({ where: { name: name } });

            if (!productRecord) {
                productRecord = await db.Product.create({
                    name,
                    quantity,
                    amount,
                    price,
                    sku,
                    unit,
                    portion,
                    paymentId: paymentRecord.id
                });
            }
        }

        res.status(201).json({ message: 'Payment, user, and product created/updated successfully' });
    } catch (error) {
        logger.error(`Error occurred: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};
