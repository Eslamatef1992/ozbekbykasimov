const express = require('express');
const ctrl = require('../controllers/extraController');
const { requireAuth, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', ctrl.list); // public
router.post('/', requireAuth, requirePermission('extras'), ctrl.create);
router.patch('/:id', requireAuth, requirePermission('extras'), ctrl.update);
router.delete('/:id', requireAuth, requirePermission('extras'), ctrl.remove);

module.exports = router;
