const express = require('express');
const ctrl = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.patch('/me', ctrl.updateMe);
router.get('/', requireAdmin, ctrl.list);
router.patch('/:id/active', requireAdmin, ctrl.setActive);

module.exports = router;
