const nodemailer = require('nodemailer');
const { Payment, Product, User } = require('../models');
const logger = require('../logger')

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
            service: 'gmail',
            auth: {
                user: 'evgenskas@gmail.com',
                pass: 'iicj qtxy tcnd mant'
            }, 
            port: 465, 
            secure: true,
            debug: true
        });

        transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
          });

        let mailOptions = {
            from: userEmail,
            to: 'myheatsticks88@gmail.com',
            subject: 'Reorder Details',
            html: emailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(`Failed to send email: ${error.message}`);
                return res.status(500).json({ error: 'Failed to send email', details: error });
            }
            res.status(200).json({ message: 'Reorder email sent successfully', info });
        });


    } catch (error) {
        logger.error(`Failed to send email: ${error.message}`);
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}