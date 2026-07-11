const express = require('express');
const ctrl = require('../controllers/statsController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireAdmin, ctrl.overview);

module.exports = router;
