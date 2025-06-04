const Product = require('../models/Product');

const authorizeProductOwner = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.role == 'admin') {
      return next(); // Admins can access any product
    }   
    
    if (product.seller_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this product' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = authorizeProductOwner;
