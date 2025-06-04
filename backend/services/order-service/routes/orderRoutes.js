const express = require('express');
const router = express.Router();

const orderController = require('../controller/orderController');
const auth = require('../middleware/auth');
const authorizeOrderOwner = require('../middleware/authorizeOrderOwner');

router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/:id', auth, authorizeOrderOwner, orderController.getOrderById);

module.exports = router;
