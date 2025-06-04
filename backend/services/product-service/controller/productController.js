const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getOne = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

exports.create = async (req, res) => {
  console.log(req.user);
  const newProduct = await Product.create({ ...req.body, seller_id: req.user.id });
  res.status(201).json(newProduct);
};

exports.update = async (req, res) => {
  try {
    const productId = req.params.id;

    const updated = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          quantity: req.body.quantity,
          category: req.body.category,
          image_url: req.body.image_url
        }
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.reduceStock = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.quantity} left.` });
    }

    product.quantity -= quantity;
    await product.save();

    res.status(200).json({ message: 'Stock reduced', productId, remaining: product.quantity });
  } catch (err) {
    console.error('Stock update error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkOwnership = async (req, res) => {
  const { productId } = req.body; 
  const sellerId = req.headers['user-id'];

  if (!productId || !sellerId) {
    return res.status(400).json({ owned: false, message: 'Invalid input.' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ owned: false, message: 'Product not found.' });
    }

    const isOwner = product.seller_id === sellerId;

    return res.json({ owned: isOwner });
  } catch (err) {
    console.error('Ownership check error:', err.message);
    return res.status(500).json({ owned: false });
  }
};
