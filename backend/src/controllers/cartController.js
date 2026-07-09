const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

exports.list = asyncHandler(async (req, res) => {
  res.json(await Cart.listForUser(req.user.id));
});

exports.addItem = asyncHandler(async (req, res) => {
  const { menu_item_id, quantity, notes } = req.body;
  if (!menu_item_id) { res.status(400); throw new Error('menu_item_id is required'); }
  await Cart.addItem(req.user.id, menu_item_id, quantity || 1, notes);
  res.status(201).json(await Cart.listForUser(req.user.id));
});

exports.updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) { res.status(400); throw new Error('quantity must be >= 1'); }
  await Cart.updateQuantity(req.user.id, req.params.id, quantity);
  res.json(await Cart.listForUser(req.user.id));
});

exports.removeItem = asyncHandler(async (req, res) => {
  await Cart.removeItem(req.user.id, req.params.id);
  res.json(await Cart.listForUser(req.user.id));
});

exports.clear = asyncHandler(async (req, res) => {
  await Cart.clear(req.user.id);
  res.status(204).send();
});
