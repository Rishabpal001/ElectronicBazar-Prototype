-- seed_electronics.sql  DEMO DATA for Electronic Bazar (100% electronics).
-- Run in the Supabase SQL Editor AFTER migrations 0001-0006. Safe to run again: it refreshes the demo products, never deletes anything.
-- Products use fictional brands and have no photos (the shop shows an icon tile and a small "Sample" badge).
-- Add real photos from Admin > Products, or delete the sample products before you launch.
-- Prices are in paise: 7999900 = Rs 79,999.

-- ---------- categories ----------
insert into public.categories (slug, name, description, sort_order) values
  ('smartphones',     'Smartphones',        'Latest phones for every budget',  1),
  ('laptops',         'Laptops',            'Work, study and play',            2),
  ('audio-headphones','Audio & Headphones', 'Headphones, speakers and more',   3),
  ('smart-watches',   'Smart Watches',      'Fitness and style on your wrist', 4),
  ('accessories',     'Accessories',        'Earbuds, chargers and cables',    5),
  ('home-appliances', 'Home Appliances',    'Make home life easier',           6),
  ('gaming-zone',     'Gaming Zone',        'Controllers, consoles and gear',  7),
  ('cameras',         'Cameras',            'Capture every moment',            8),
  ('tv-displays',     'TV & Displays',      'Big screens, sharp pictures',     9),
  ('others',          'Others',             'Routers, storage and more',       10)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order, is_active = true;

-- ---------- products (20 demo items, 2 per category) ----------
insert into public.products
  (sku, slug, name, description, category_id, product_type, price_minor, sale_price_minor,
   track_inventory, stock_qty, is_featured, is_sample, personalization_enabled, delivery_min_days, delivery_max_days, sold_count,
   brand, warranty, highlights)
select v.sku, v.slug, v.name, v.description, c.id, 'physical', v.price, v.sale,
       true, v.stock, v.featured, true, false, v.dmin, v.dmax, v.sold, v.brand, v.warranty, v.hl::jsonb
from (values
  -- smartphones
  ('ESB-001','nova-x-ultra-5g',    'Nova X Ultra 5G Smartphone',      'Flagship phone with a bright AMOLED display, 200MP camera and all-day battery.',            'smartphones',      'Nova',    12299900, 7999900, 40,  true,  3, 6, 120, '1 Year Brand Warranty',   '[{"label":"Camera","value":"200MP"},{"label":"Processor","value":"Octa-core 3.3GHz"},{"label":"Updates","value":"7 Years"}]'),
  ('ESB-002','nova-lite-5g',       'Nova Lite 5G Smartphone',         'Value 5G phone for everyday use with a big battery and smooth display.',                    'smartphones',      'Nova',     2199900, 1699900, 80,  false, 3, 6, 95,  '1 Year Brand Warranty',   '[{"label":"Camera","value":"50MP"},{"label":"Battery","value":"5000mAh"}]'),
  -- laptops
  ('ESB-003','voltix-book-15',     'Voltix Book 15 Laptop',           'Slim 15 inch laptop for work and study with a fast SSD and all-day battery.',               'laptops',          'Voltix',   5799000, 3499900, 25,  true,  4, 7, 60,  '1 Year Onsite Warranty',  '[{"label":"Display","value":"15.6 inch FHD"},{"label":"RAM","value":"16GB"},{"label":"Storage","value":"512GB SSD"}]'),
  ('ESB-011','voltix-air-14',      'Voltix Air 14 Thin & Light Laptop','Lightweight 14 inch laptop for students and travel.',                                    'laptops',          'Voltix',   4299000, 3199900, 30,  false, 4, 7, 48,  '1 Year Onsite Warranty',  '[{"label":"Display","value":"14 inch FHD"},{"label":"Weight","value":"1.3 kg"},{"label":"Battery","value":"12 Hours"}]'),
  -- audio
  ('ESB-004','pulse-wh-1000',      'Pulse WH-1000 Wireless Headphones','Over-ear wireless headphones with active noise cancelling and 30 hour battery.',          'audio-headphones', 'Pulse',    2999000, 2499900, 60,  true,  3, 6, 150, '1 Year Warranty',         '[{"label":"Battery","value":"30 Hours"},{"label":"Type","value":"Over-ear"},{"label":"ANC","value":"Yes"}]'),
  ('ESB-012','pulse-go-speaker',   'Pulse Go Portable Bluetooth Speaker','Pocket speaker with deep bass and splash resistance.',                                'audio-headphones', 'Pulse',     399900,  249900, 120, false, 2, 5, 210, '1 Year Warranty',         '[{"label":"Playtime","value":"12 Hours"},{"label":"Water","value":"IPX7"}]'),
  -- smart watches
  ('ESB-005','wave-watch-pro',     'Wave Watch Pro Smartwatch',       'Smartwatch with AMOLED display, heart-rate and sleep tracking.',                            'smart-watches',    'Wave',      359900,  249900, 90,  true,  3, 6, 210, '6 Months Warranty',       '[{"label":"Display","value":"1.8 inch AMOLED"},{"label":"Battery","value":"7 Days"}]'),
  ('ESB-013','wave-fit-band',      'Wave Fit Band Fitness Tracker',   'Slim fitness band with step, heart-rate and SpO2 tracking.',                                'smart-watches',    'Wave',      349900,  179900, 150, false, 2, 5, 260, '6 Months Warranty',       '[{"label":"Battery","value":"14 Days"},{"label":"Water","value":"5 ATM"}]'),
  -- accessories
  ('ESB-006','buds-t300',          'Buds T300 True Wireless Earbuds', 'Compact true wireless earbuds with clear calls and long playback.',                         'accessories',      'Wave',      364900,  199900, 200, false, 2, 5, 320, '6 Months Warranty',       '[{"label":"Playback","value":"40 Hours"},{"label":"Water","value":"IPX4"}]'),
  ('ESB-014','volt-65w-gan-charger','Volt 65W GaN Fast Charger',      'Small 65W charger for phone, tablet and laptop with USB-C.',                                'accessories',      'Volt',      249900,  149900, 180, false, 2, 5, 140, '1 Year Warranty',         '[{"label":"Power","value":"65W"},{"label":"Ports","value":"2x USB-C, 1x USB-A"}]'),
  -- home appliances
  ('ESB-007','blendpro-750w-mixer','BlendPro 750W Mixer Grinder',     'Three-jar mixer grinder with a strong 750W motor.',                                         'home-appliances',  'BlendPro',  649900,  499900, 35,  false, 4, 8, 44,  '2 Years Motor Warranty',  '[{"label":"Power","value":"750W"},{"label":"Jars","value":"3"}]'),
  ('ESB-015','chefair-4l-air-fryer','ChefAir 4L Digital Air Fryer',   'Cook crispy snacks with little oil. Digital touch controls.',                               'home-appliances',  'ChefAir',  1099900,  749900, 28,  true,  4, 8, 62,  '1 Year Warranty',         '[{"label":"Capacity","value":"4 Litre"},{"label":"Power","value":"1500W"}]'),
  -- gaming
  ('ESB-008','pad-one-controller', 'Pad One Wireless Controller',     'Wireless game controller for PC and mobile. (Shown out of stock on purpose.)',               'gaming-zone',      'Pad',       599900,  499900, 0,   false, 3, 6, 70,  '1 Year Warranty',         '[{"label":"Connect","value":"Bluetooth"},{"label":"Battery","value":"30 Hours"}]'),
  ('ESB-016','pad-pro-headset',    'Pad Pro Gaming Headset',          'Surround sound gaming headset with a noise-cancelling mic.',                                'gaming-zone',      'Pad',       499900,  349900, 55,  false, 3, 6, 38,  '1 Year Warranty',         '[{"label":"Sound","value":"7.1 Surround"},{"label":"Connect","value":"USB + 3.5mm"}]'),
  -- cameras
  ('ESB-009','lens-r50-mirrorless','Lens R50 Mirrorless Camera',      'Mirrorless camera with kit lens for photos and 4K video.',                                  'cameras',          'Lens',     7499900,  6499900, 12,  true,  5, 9, 18,  '2 Years Warranty',        '[{"label":"Sensor","value":"24MP APS-C"},{"label":"Video","value":"4K 30fps"}]'),
  ('ESB-017','lens-action-4k',     'Lens Action 4K Camera',           'Rugged action camera with stabilised 4K video and waterproof case.',                        'cameras',          'Lens',     1599900,  1199900, 22,  false, 4, 8, 29,  '1 Year Warranty',         '[{"label":"Video","value":"4K 60fps"},{"label":"Water","value":"10 m case"}]'),
  -- tv
  ('ESB-010','vista-55-4k-tv',     'Vista 55 inch 4K Smart TV',       '55 inch 4K smart TV with built-in streaming apps.',                                         'tv-displays',      'Vista',    4999900,  3499900, 15,  true,  5, 9, 26,  '1 Year Warranty',         '[{"label":"Screen","value":"55 inch 4K"},{"label":"Refresh","value":"60Hz"}]'),
  ('ESB-018','vista-32-hd-tv',     'Vista 32 inch HD Smart TV',       'Compact 32 inch smart TV for bedrooms and small rooms.',                                    'tv-displays',      'Vista',    1699900,  1299900, 34,  false, 5, 9, 41,  '1 Year Warranty',         '[{"label":"Screen","value":"32 inch HD"},{"label":"Apps","value":"Built-in"}]'),
  -- others
  ('ESB-019','link-wifi6-router',  'Link AX1800 WiFi 6 Router',       'Dual-band WiFi 6 router for fast, stable home internet.',                                   'others',           'Link',     1099900,   699900, 45,  false, 3, 6, 57,  '3 Years Warranty',        '[{"label":"Speed","value":"AX1800"},{"label":"Bands","value":"Dual-band"}]'),
  ('ESB-020','store-1tb-ssd',      'Store 1TB Portable SSD',          'Pocket-size 1TB SSD with fast transfers for backups and videos.',                           'others',           'Store',    1299900,   899900, 40,  false, 3, 6, 73,  '3 Years Warranty',        '[{"label":"Capacity","value":"1TB"},{"label":"Speed","value":"1050 MB/s"}]')
) as v(sku, slug, name, description, cat, brand, price, sale, stock, featured, dmin, dmax, sold, warranty, hl)
join public.categories c on c.slug = v.cat
on conflict (sku) do update set
  slug = excluded.slug, name = excluded.name, description = excluded.description, category_id = excluded.category_id,
  price_minor = excluded.price_minor, sale_price_minor = excluded.sale_price_minor, is_featured = excluded.is_featured,
  brand = excluded.brand, warranty = excluded.warranty, highlights = excluded.highlights, is_active = true;

-- ---------- options (shown as "Choose option" on the product page) ----------
insert into public.product_variants (product_id, label, size, finish, paper, price_delta_minor, position)
select p.id, v.label, v.storage, v.color, null, v.delta, v.pos
from (values
  ('ESB-001', '256GB / Black',   '256GB', 'Black',  0,       1),
  ('ESB-001', '512GB / Black',   '512GB', 'Black',  1000000, 2),
  ('ESB-001', '512GB / Silver',  '512GB', 'Silver', 1000000, 3),
  ('ESB-003', '16GB / 512GB',    '512GB', null,     0,       1),
  ('ESB-003', '16GB / 1TB',      '1TB',   null,     1200000, 2),
  ('ESB-005', 'Black strap',     null,    'Black',  0,       1),
  ('ESB-005', 'Blue strap',      null,    'Blue',   0,       2),
  ('ESB-020', '1TB',             '1TB',   null,     0,       1),
  ('ESB-020', '2TB',             '2TB',   null,     800000,  2)
) as v(sku, label, storage, color, delta, pos)
join public.products p on p.sku = v.sku
where not exists (select 1 from public.product_variants pv where pv.product_id = p.id and pv.label = v.label);

-- ---------- bulk pricing example ----------
insert into public.product_price_tiers (product_id, min_qty, unit_price_minor)
select p.id, v.minq, v.unit
from (values ('ESB-006', 3, 179900), ('ESB-006', 10, 159900), ('ESB-014', 3, 134900)) as v(sku, minq, unit)
join public.products p on p.sku = v.sku
on conflict (product_id, min_qty) do nothing;

-- ---------- order options (off by default for electronics; turn on per product in Admin) ----------
insert into public.customization_fields (scope, key, label, help_text, field_type, is_required, max_length, extra_price_minor, position)
values
  ('global','gift_message','Gift message','Optional note to include in the parcel.','textarea', false, 150, 0, 1),
  ('global','order_note',  'Order note',  'Anything we should know?',               'textarea', false, 200, 0, 2)
on conflict do nothing;
