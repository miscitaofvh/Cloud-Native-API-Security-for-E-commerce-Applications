const { body, validationResult } = require('express-validator');

const productValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer >= 0'),

  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),

  body('category')
    .optional()
    .isString()
    .trim()
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  productValidationRules,
  validate
};
