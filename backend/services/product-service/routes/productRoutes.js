const express = require('express');
const router = express.Router();

const ctrl = require('../controller/productController');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const authorizeProductOwner = require('../middleware/authorizeProductOwner');
const { productValidationRules, validate } = require('../middleware/validateProduct');
const authorizeInternal = require('../middleware/authorizeInternal');

// Public routes
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Protected routes: must be authenticated first
router.post('/', auth, authorizeRole, productValidationRules, validate, ctrl.create);
router.put('/:id', auth, authorizeRole, authorizeProductOwner, productValidationRules, validate, ctrl.update);
router.delete('/:id', auth, authorizeRole, authorizeProductOwner, ctrl.remove);
router.patch('/:id/stock', authorizeInternal, ctrl.reduceStock);
router.post('/ownership-check', authorizeInternal, ctrl.checkOwnership);

module.exports = router;
