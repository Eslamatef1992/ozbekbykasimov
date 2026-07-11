const express = require('express');
const ctrl = require('../controllers/userController');
const { requireAuth, requireAdmin, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/me', ctrl.me);
router.patch('/me', ctrl.updateMe);
router.patch('/me/address', ctrl.updateAddress);
router.patch('/me/password', ctrl.updatePassword);
router.get('/admins', requirePermission('admins'), ctrl.listAdmins);
router.post('/admins', requirePermission('admins'), ctrl.createAdmin);
router.patch('/:id/permissions', requirePermission('admins'), ctrl.updatePermissions);
router.get('/', requireAdmin, ctrl.list);
router.patch('/:id/active', requireAdmin, ctrl.setActive);

module.exports = router;
