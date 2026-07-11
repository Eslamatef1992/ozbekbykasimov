const express = require('express');
const ctrl = require('../controllers/deliveryAreaController');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// Public read (checkout needs the active list). Mutations are restricted to
// the true "admin" role only - staff, even with other permissions, cannot
// change delivery fees or sort order.
router.get('/', ctrl.list);
router.post('/', requireAuth, requireSuperAdmin, ctrl.create);
router.patch('/:id', requireAuth, requireSuperAdmin, ctrl.update);
router.delete('/:id', requireAuth, requireSuperAdmin, ctrl.remove);

module.exports = router;
