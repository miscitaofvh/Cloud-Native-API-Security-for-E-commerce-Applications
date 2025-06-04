const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check for required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // 2. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Proceed to controller
  next();
};

module.exports = validateLogin;