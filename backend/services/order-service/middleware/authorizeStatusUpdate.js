const Order = require('../models/Order');
const axios = require('axios');
const https = require('https');

const PRODUCT_SERVICE_URL = 'https://nginx/products';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const authorizeStatusUpdate = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;
    const newStatus = req.body.status;

    if (!VALID_STATUSES.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (role === 'ADMIN') {
      req.order = order;
      return next();
    }

    if (role !== 'SELLER') {
      return res.status(403).json({ message: 'Only seller or admin can update order status.' });
    }

    const productIds = order.items.map(item => item.product);

    const response = await axios.post(
      `${PRODUCT_SERVICE_URL}/ownership-check`,
      { productIds },
      {
        httpsAgent,
        headers: {
          'x-internal-secret': process.env.INTERNAL_SECRET,
          'user-id': userId,
        },
      }
    );

    if (response.data && response.data.owned === true) {
      req.order = order;
      return next();
    }

    return res.status(403).json({ message: 'You are not authorized to update this order.' });

  } catch (err) {
    console.error('Status update authorization error:', err.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = authorizeStatusUpdate;
