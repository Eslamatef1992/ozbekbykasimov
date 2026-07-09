const express = require('express');
const ctrl = require('../controllers/settingsController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', ctrl.getAll);
router.put('/', requireAuth, requireAdmin, ctrl.update);

module.exports = router;
