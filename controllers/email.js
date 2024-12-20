const nodemailer = require('nodemailer');
const { Payment, Product, User } = require('../models');
const logger = require('../logger')
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const storeEmail = config.email_agent_username ? process.env[config.email_agent_username] : config.emailAgentUserName
const storeEmailPass = config.email_agent_username ? process.env[config.email_agent_password] : config.emailAgentUserPassword

exports.reorder = async (req, res) => {
    try {
        const orderId = req.query.orderid;
        const userEmail = req.query.Email;

        if (!orderId) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }
        if (!userEmail) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findOne({
            where: { Email: userEmail },
        });

        const payment = await Payment.findOne({
            where: { orderid: orderId },
            include: [{
                model: Product,
                as: 'products'
            }]
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const emailContent = `
            <h1>Reorder Details</h1>
            <p>Payment ID: ${payment.id}</p>
            <p>Order ID: ${payment.orderid}</p>
            <p>Amount: $${payment.amount}</p>
            ${!payment.delivery ? "" : `<p>Delivery: $${payment.delivery}</p> <p>Delivery Price: $${payment.deliveryPrice}</p>`}
            <h2>Products:</h2>
            <ul>
                ${payment.products.map(product => `
                    <li>
                        ${product.name} (Quantity: ${product.quantity}, Price: $${product.price}, Amount: $${product.amount})
                    </li>
                `).join('')}
            </ul>
            <p>User Name: ${user.Name}</p>
            <p>User Email: ${user.Email}</p>
            <p>User Phone: ${user.Phone}</p>
            <p>User Address: ${user.Address}</p>
            <p>User City: ${user.city}</p>
            <p>User postcode: ${user.postcode}</p>
            <p>User Country: ${user.country}</p>
            <p>User region: ${user.region}</p>
            <p>User Country: ${user.country}</p>
        `;

        let transporter = nodemailer.createTransport({
            // This is the SMTP mail server to use for notifications. 
            // GCDS uses this mail server as a relay host.
            host: "smtp.gmail.com",
            // SMTP is unlike most network protocols, which only have a single port number. 
            // SMTP has at least 3. They are port numbers 25, 587, and 465.
            // Port 25 is still widely used as a **relay** port from one server to another.
            // Port for SSL: 465
            // Port for TLS/STARTTLS: 587
            port: 587,
            secure: false,
            auth: {
                user: storeEmail,
                pass: storeEmailPass
            },
            tls: {
                rejectUnauthorized: false
            },
            logger: true,
        });

        let mailOptions = {
            from: userEmail,
            to: storeEmail,
            subject: 'Reorder Details',
            html: emailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(`Failed to send email: ${error.message}`);
                return res.status(500).json({ error: 'Failed to send email', details: error });
            }
        });

        const emailForCustomer = `
        <h1>Hello ${user.Name}!</h1> 
        <p> Thank you for the reorder ${payment.orderid} in our store.</p>
        <p>Amount: $${payment.amount}</p>
        ${!payment.delivery ? "" : `<p>Delivery: $${payment.delivery}</p> <p>Delivery Price: $${payment.deliveryPrice}</p>`}
        <p>You will soon receive an email with the payment details.After receiving the payment, we will start processing your order:</p>
        
        <ul>
            ${payment.products.map(product => `
                <li>
                    ${product.name} (Quantity: ${product.quantity}, Price: $${product.price}, Amount: $${product.amount})
                </li>
            `).join('')}
        </ul>

        <p>If you have any questions, just reply to this email.</p>
        <p>Thanks you for choosing our store.</p>
        <p>And have a great day!</p>

        <p>Our contact information:</p>
        <p>https://myheatsticks.net/contact</p>
        `
        let customerMailOptions = {
            from: storeEmail,
            to: userEmail,
            subject: 'Myheatsticks Reorder Details',
            html: emailForCustomer
        };

        transporter.sendMail(customerMailOptions, (error, info) => {
            if (error) {
                logger.error(`Failed to send email: ${error.message}`);
                return res.status(500).json({ error: 'Failed to send email to customer ', details: error });
            }
            res.status(200).json({ message: 'Reorder email sent successfully', info });
        });

    } catch (error) {
        logger.error(`Failed to send email: ${error.message}`);
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}