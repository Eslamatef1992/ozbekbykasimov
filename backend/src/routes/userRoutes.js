const express = require('express');
const ctrl = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/me', ctrl.me);
router.patch('/me', ctrl.updateMe);
router.patch('/me/address', ctrl.updateAddress);
router.patch('/me/password', ctrl.updatePassword);
router.get('/', requireAdmin, ctrl.list);
router.patch('/:id/active', requireAdmin, ctrl.setActive);

module.exports = router;
