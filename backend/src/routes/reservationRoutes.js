const express = require('express');
const ctrl = require('../controllers/reservationController');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Guests can book a table too (matches Figma "book a table" screen)
router.post('/', optionalAuth, ctrl.create);
router.get('/mine', requireAuth, ctrl.mine);
router.get('/', requireAuth, requireAdmin, ctrl.listAll);
router.patch('/:id/status', requireAuth, requireAdmin, ctrl.updateStatus);

module.exports = router;
