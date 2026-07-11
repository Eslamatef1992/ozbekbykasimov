const express = require('express');

const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/menu', require('./menuRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/reservations', require('./reservationRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/settings', require('./settingsRoutes'));
router.use('/uploads', require('./uploadRoutes'));
router.use('/coupons', require('./couponRoutes'));
router.use('/extras', require('./extraRoutes'));
router.use('/stats', require('./statsRoutes'));
router.use('/delivery-areas', require('./deliveryAreaRoutes'));

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

module.exports = router;
