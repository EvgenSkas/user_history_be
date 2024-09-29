const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const emailControllers = require('../controllers/email');

router.get('/users', controller.getAllUsers);
router.get('/products', controller.getAllProducts);
router.get('/payments', controller.getAllPayments);
router.get('/userPayment', controller.getUserPayments);
router.post('/webhook', controller.registerPayment);
router.get('/reorder', emailControllers.reorder);

module.exports = router;