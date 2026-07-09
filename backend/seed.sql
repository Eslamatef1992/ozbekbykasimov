-- Sample content so the site isn't empty on first run.
-- Run: mysql -u root -p ozbek_restaurant < seed.sql
USE ozbek_restaurant;

-- Category set matches the Figma menu page (Salad, Juice, Rice, Chicken, Meat, Fish, Pasta, Soup)
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Salad', 'salad', 1),
  ('Juice', 'juice', 2),
  ('Rice', 'rice', 3),
  ('Chicken', 'chicken', 4),
  ('Meat', 'meat', 5),
  ('Fish', 'fish', 6),
  ('Pasta', 'pasta', 7),
  ('Soup', 'soup', 8)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Prices are whole-number Kd (Kuwaiti Dinar) to match the design's "50 Kd" style.
INSERT INTO menu_items (category_id, name, slug, description, price, is_featured) VALUES
  ((SELECT id FROM categories WHERE slug='rice'), 'Plov', 'plov', 'Traditional Uzbek rice pilaf with lamb, carrots and spices.', 5, 1),
  ((SELECT id FROM categories WHERE slug='meat'), 'Lamb Shashlik', 'lamb-shashlik', 'Grilled skewered lamb marinated in house spices.', 6, 1),
  ((SELECT id FROM categories WHERE slug='soup'), 'Lagman Soup', 'lagman-soup', 'Hand-pulled noodle soup with beef and vegetables.', 4, 1),
  ((SELECT id FROM categories WHERE slug='salad'), 'Achichuk Salad', 'achichuk-salad', 'Fresh tomato and onion salad.', 3, 1),
  ((SELECT id FROM categories WHERE slug='chicken'), 'Chicken Kebab', 'chicken-kebab', 'Char-grilled chicken skewers with house spices.', 5, 0),
  ((SELECT id FROM categories WHERE slug='fish'), 'Grilled Sea Bass', 'grilled-sea-bass', 'Whole grilled sea bass with lemon and herbs.', 7, 0),
  ((SELECT id FROM categories WHERE slug='pasta'), 'Uzbek Style Pasta', 'uzbek-style-pasta', 'House pasta tossed in a rich tomato and lamb ragu.', 5, 0),
  ((SELECT id FROM categories WHERE slug='juice'), 'Fresh Pomegranate Juice', 'fresh-pomegranate-juice', 'Freshly pressed pomegranate juice.', 2, 0)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('site_name', 'Ozbek By Kasimov'),
  ('contact_phone', '+998 00 000 00 00'),
  ('contact_email', 'info@ozbekbykasimov.com'),
  ('address', 'TBD'),
  ('opening_hours', 'Mon-Sun: 10:00 - 23:00')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
