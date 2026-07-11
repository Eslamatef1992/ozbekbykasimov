const express = require('express');
const ctrl = require('../controllers/orderController');
const { requireAuth, requireAdmin, requirePermission, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Guests can check out too (matches "Guest Orders") - optionalAuth attaches
// req.user when a valid token is present but never rejects the request.
router.post('/', optionalAuth, ctrl.checkout);
router.get('/mine', requireAuth, ctrl.myOrders);
router.get('/:id', requireAuth, ctrl.getOne);
router.get('/', requireAuth, requirePermission('orders'), ctrl.listAll);
router.patch('/:id/status', requireAuth, requirePermission('orders'), ctrl.updateStatus);

module.exports = router;
