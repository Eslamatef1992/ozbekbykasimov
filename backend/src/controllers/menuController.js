const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');
const slugify = require('../utils/slugify');

// GET /api/menu?category=slug|id&search=&all=true(admin)
exports.list = asyncHandler(async (req, res) => {
  const { category, search, all } = req.query;
  res.json(await MenuItem.list({ categoryId: category || undefined, onlyAvailable: all !== 'true', search }));
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = /^\d+$/.test(req.params.idOrSlug)
    ? await MenuItem.findById(req.params.idOrSlug)
    : await MenuItem.findBySlug(req.params.idOrSlug);
  if (!item) { res.status(404); throw new Error('Menu item not found'); }
  res.json(item);
});

exports.create = asyncHandler(async (req, res) => {
  const { category_id, name, description, price, image_url, is_featured, sort_order } = req.body;
  if (!category_id || !name || price === undefined) {
    res.status(400);
    throw new Error('category_id, name and price are required');
  }
  const id = await MenuItem.create({
    category_id, name, slug: slugify(name), description, price, image_url, is_featured, sort_order,
  });
  res.status(201).json(await MenuItem.findById(id));
});

exports.update = asyncHandler(async (req, res) => {
  const existing = await MenuItem.findById(req.params.id);
  if (!existing) { res.status(404); throw new Error('Menu item not found'); }
  const body = req.body;
  await MenuItem.update(req.params.id, {
    category_id: body.category_id ?? existing.category_id,
    name: body.name ?? existing.name,
    slug: body.name ? slugify(body.name) : existing.slug,
    description: body.description ?? existing.description,
    price: body.price ?? existing.price,
    image_url: body.image_url ?? existing.image_url,
    is_available: body.is_available ?? existing.is_available,
    is_featured: body.is_featured ?? existing.is_featured,
    sort_order: body.sort_order ?? existing.sort_order,
  });
  res.json(await MenuItem.findById(req.params.id));
});

exports.remove = asyncHandler(async (req, res) => {
  await MenuItem.remove(req.params.id);
  res.status(204).send();
});
