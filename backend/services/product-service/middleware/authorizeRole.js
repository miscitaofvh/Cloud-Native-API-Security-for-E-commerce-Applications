const authorizeRole = (req, res, next) => {
  const role = req.user?.role;

  if (role !== 'SELLER' && role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: only sellers or admins can perform this action' });
  }

  next(); 
};

module.exports = authorizeRole;
