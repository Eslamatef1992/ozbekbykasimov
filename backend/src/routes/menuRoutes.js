const express = require('express');
const ctrl = require('../controllers/menuController');
const { requireAuth, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:idOrSlug', ctrl.getOne);
router.post('/', requireAuth, requirePermission('menu'), ctrl.create);
router.patch('/:id', requireAuth, requirePermission('menu'), ctrl.update);
router.delete('/:id', requireAuth, requirePermission('menu'), ctrl.remove);

module.exports = router;
