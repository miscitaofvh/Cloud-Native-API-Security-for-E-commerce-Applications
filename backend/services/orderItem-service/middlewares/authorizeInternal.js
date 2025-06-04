const internalSecret = process.env.INTERNAL_SECRET;

const authorizeInternal = (req, res, next) => {
  if (req.headers['x-internal-secret'] !== internalSecret) {
    return res.status(403).json({ message: 'Unauthorized internal request' });
  }
  next();
};

module.exports = authorizeInternal;