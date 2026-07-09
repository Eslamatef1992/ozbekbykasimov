const express = require('express');
const ctrl = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', ctrl.list);
router.post('/items', ctrl.addItem);
router.patch('/items/:id', ctrl.updateItem);
router.delete('/items/:id', ctrl.removeItem);
router.delete('/', ctrl.clear);

module.exports = router;
