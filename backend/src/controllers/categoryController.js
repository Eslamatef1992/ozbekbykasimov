const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const slugify = require('../utils/slugify');

exports.list = asyncHandler(async (req, res) => {
  const onlyActive = req.query.all !== 'true';
  res.json(await Category.list({ onlyActive }));
});

exports.create = asyncHandler(async (req, res) => {
  const { name, name_ar, image_url, sort_order } = req.body;
  if (!name) { res.status(400); throw new Error('name is required'); }
  const id = await Category.create({ name, name_ar, slug: slugify(name), image_url, sort_order: sort_order || 0 });
  res.status(201).json(await Category.findById(id));
});

exports.update = asyncHandler(async (req, res) => {
  const existing = await Category.findById(req.params.id);
  if (!existing) { res.status(404); throw new Error('Category not found'); }
  const { name, name_ar, image_url, sort_order, is_active } = req.body;
  await Category.update(req.params.id, {
    name: name ?? existing.name,
    name_ar: name_ar ?? existing.name_ar,
    slug: name ? slugify(name) : existing.slug,
    image_url: image_url ?? existing.image_url,
    sort_order: sort_order ?? existing.sort_order,
    is_active: is_active ?? existing.is_active,
  });
  res.json(await Category.findById(req.params.id));
});

exports.remove = asyncHandler(async (req, res) => {
  await Category.remove(req.params.id);
  res.status(204).send();
});
