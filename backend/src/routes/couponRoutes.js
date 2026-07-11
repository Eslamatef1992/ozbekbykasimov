const express = require('express');
const ctrl = require('../controllers/couponController');
const { requireAuth, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.post('/validate', ctrl.validate); // public - checkout coupon field
router.get('/', requireAuth, requirePermission('coupons'), ctrl.list);
router.post('/', requireAuth, requirePermission('coupons'), ctrl.create);
router.patch('/:id', requireAuth, requirePermission('coupons'), ctrl.update);
router.delete('/:id', requireAuth, requirePermission('coupons'), ctrl.remove);

module.exports = router;
