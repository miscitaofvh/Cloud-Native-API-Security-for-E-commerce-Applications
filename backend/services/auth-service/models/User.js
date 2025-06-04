const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['ADMIN', 'CUSTOMER', 'SELLER'], default: 'CUSTOMER' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);