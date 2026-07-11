const express = require('express');
const ctrl = require('../controllers/settingsController');
const { requireAuth, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', ctrl.getAll);
router.put('/', requireAuth, requirePermission('cms'), ctrl.update);

module.exports = router;
