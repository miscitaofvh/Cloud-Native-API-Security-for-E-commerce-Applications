const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(403).json({ message: 'Forbidden. Invalid or expired token.' });
  }
};

module.exports = authenticateUser;
