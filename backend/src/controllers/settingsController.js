const asyncHandler = require('express-async-handler');
const Setting = require('../models/Setting');

// GET /api/settings  (public - powers About Us / Contact Us pages)
exports.getAll = asyncHandler(async (req, res) => {
  res.json(await Setting.getAll());
});

// PUT /api/settings  (admin)
exports.update = asyncHandler(async (req, res) => {
  await Setting.setMany(req.body);
  res.json(await Setting.getAll());
});
