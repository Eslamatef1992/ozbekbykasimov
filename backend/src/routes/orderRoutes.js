const express = require('express');
const ctrl = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.post('/', ctrl.checkout);
router.get('/mine', ctrl.myOrders);
router.get('/:id', ctrl.getOne);
router.get('/', requireAdmin, ctrl.listAll);
router.patch('/:id/status', requireAdmin, ctrl.updateStatus);

module.exports = router;
