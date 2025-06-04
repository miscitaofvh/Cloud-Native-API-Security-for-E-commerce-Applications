const User = require('../models/User');

const allowedRoles = ['CUSTOMER', 'SELLER'];

const validateRegister = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // 1. Check for required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields: name, email, password or role.' });
  }

  // 2. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // 3. Validate role
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'You are not allowed to assign this role.' });
  }

  // 4. Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }

  next();
};

module.exports = validateRegister;