const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// POST /api/uploads (admin) - multipart field name "image"
router.post('/', requireAuth, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
