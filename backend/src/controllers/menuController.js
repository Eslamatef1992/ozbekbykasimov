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
  const [images, extras] = await Promise.all([
    MenuItem.getImages(item.id),
    item.has_extras ? MenuItem.getExtras(item.id) : Promise.resolve([]),
  ]);
  res.json({ ...item, images, extras });
});

exports.create = asyncHandler(async (req, res) => {
  const { category_id, name, name_ar, description, description_ar, price, image_url, has_extras, is_featured, sort_order, extra_ids, sub_images } = req.body;
  if (!category_id || !name || price === undefined) {
    res.status(400);
    throw new Error('category_id, name and price are required');
  }
  const id = await MenuItem.create({
    category_id, name, name_ar, slug: slugify(name), description, description_ar, price, image_url,
    has_extras, is_featured, sort_order,
  });
  if (has_extras && Array.isArray(extra_ids)) await MenuItem.setExtras(id, extra_ids);
  if (Array.isArray(sub_images)) {
    for (let i = 0; i < sub_images.length; i++) await MenuItem.addImage(id, sub_images[i], i);
  }
  const item = await MenuItem.findById(id);
  const [images, extras] = await Promise.all([MenuItem.getImages(id), MenuItem.getExtras(id)]);
  res.status(201).json({ ...item, images, extras });
});

exports.update = asyncHandler(async (req, res) => {
  const existing = await MenuItem.findById(req.params.id);
  if (!existing) { res.status(404); throw new Error('Menu item not found'); }
  const body = req.body;
  await MenuItem.update(req.params.id, {
    category_id: body.category_id ?? existing.category_id,
    name: body.name ?? existing.name,
    name_ar: body.name_ar ?? existing.name_ar,
    slug: body.name ? slugify(body.name) : existing.slug,
    description: body.description ?? existing.description,
    description_ar: body.description_ar ?? existing.description_ar,
    price: body.price ?? existing.price,
    image_url: body.image_url ?? existing.image_url,
    has_extras: body.has_extras ?? existing.has_extras,
    is_available: body.is_available ?? existing.is_available,
    is_featured: body.is_featured ?? existing.is_featured,
    sort_order: body.sort_order ?? existing.sort_order,
  });
  if (Array.isArray(body.extra_ids)) await MenuItem.setExtras(req.params.id, body.extra_ids);
  if (Array.isArray(body.sub_images)) {
    // Replace the gallery wholesale - simplest model for the admin form's
    // "sub images" multi-upload without needing per-image diffing UI.
    const current = await MenuItem.getImages(req.params.id);
    for (const img of current) await MenuItem.removeImage(img.id, req.params.id);
    for (let i = 0; i < body.sub_images.length; i++) await MenuItem.addImage(req.params.id, body.sub_images[i], i);
  }
  const item = await MenuItem.findById(req.params.id);
  const [images, extras] = await Promise.all([MenuItem.getImages(req.params.id), MenuItem.getExtras(req.params.id)]);
  res.json({ ...item, images, extras });
});

exports.remove = asyncHandler(async (req, res) => {
  await MenuItem.remove(req.params.id);
  res.status(204).send();
});
