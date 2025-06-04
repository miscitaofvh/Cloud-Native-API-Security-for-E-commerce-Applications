const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  image_url: String,
  category: String,
  seller_id: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
