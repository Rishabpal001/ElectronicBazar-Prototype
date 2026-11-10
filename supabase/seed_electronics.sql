-- seed_electronics.sql  DEMO DATA for Electronic Bazar. Run ONCE in the Supabase SQL Editor, after migrations 0001-0006.
-- It does NOT delete anything. The old birthday-card sample products and categories are only switched off (hidden).
-- Demo products are named "[SAMPLE] ..." with fictional brands and have no photos (the shop shows an icon tile).
-- Add photos from Admin > Products, or delete the samples before you launch.

-- ---------- hide the old birthday-card demo data ----------
update public.products set is_active = false where sku like 'SMP-%';
update public.categories set is_active = false where slug in ('friends','parents','children','husband-wife','siblings','colleagues','milestone','funny','romantic','customizable');
delete from public.customization_fields where scope = 'global' and key in ('recipient_name','sender_name','message','photo','instructions');

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
  ('others',          'Others',             'More electronics',                10)
on conflict (slug) do update set is_active = true;

-- ---------- products (prices in paise: 7999900 = Rs 79,999) ----------
insert into public.products
  (sku, slug, name, description, category_id, product_type, price_minor, sale_price_minor,
   track_inventory, stock_qty, is_featured, is_sample, personalization_enabled, delivery_min_days, delivery_max_days, sold_count,
   brand, warranty, highlights)
select v.sku, v.slug, v.name, v.description, c.id, 'physical', v.price, v.sale,
       true, v.stock, v.featured, true, false, v.dmin, v.dmax, v.sold, v.brand, v.warranty, v.hl::jsonb
from (values
  ('ESB-001','sample-nova-x-ultra',   '[SAMPLE] Nova X Ultra 5G Smartphone', 'Flagship sample phone with a bright AMOLED display and all-day battery. Sample product.',         'smartphones',      'Nova',   12299900, 7999900, 40, true,  3, 6, 120, '1 Year Brand Warranty', '[{"label":"Camera","value":"200MP"},{"label":"Processor","value":"Octa-core 3.3GHz"},{"label":"Updates","value":"7 Years"}]'),
  ('ESB-002','sample-nova-lite-5g',   '[SAMPLE] Nova Lite 5G Smartphone',    'Value sample phone for everyday use. Sample product.',                                              'smartphones',      'Nova',   2199900,  1699900, 80, false, 3, 6, 95,  '1 Year Brand Warranty', '[{"label":"Camera","value":"50MP"},{"label":"Battery","value":"5000mAh"}]'),
  ('ESB-003','sample-voltix-book-15', '[SAMPLE] Voltix Book 15 Laptop',      'Slim 15-inch sample laptop for work and study. Sample product.',                                    'laptops',          'Voltix', 5799000,  3499900, 25, true,  4, 7, 60,  '1 Year Onsite Warranty', '[{"label":"Display","value":"15.6 inch FHD"},{"label":"RAM","value":"16GB"},{"label":"Storage","value":"512GB SSD"}]'),
  ('ESB-004','sample-pulse-wh-1000',  '[SAMPLE] Pulse WH-1000 Headphones',   'Wireless over-ear sample headphones with noise cancelling. Sample product.',                        'audio-headphones', 'Pulse',  2999000,  2499900, 60, true,  3, 6, 150, '1 Year Warranty',        '[{"label":"Battery","value":"30 Hours"},{"label":"Type","value":"Over-ear"},{"label":"ANC","value":"Yes"}]'),
  ('ESB-005','sample-wave-watch-pro', '[SAMPLE] Wave Watch Pro Smartwatch',  'Smartwatch sample with heart-rate and sleep tracking. Sample product.',                             'smart-watches',    'Wave',   359900,   249900,  90, true,  3, 6, 210, '6 Months Warranty',      '[{"label":"Display","value":"1.8 inch AMOLED"},{"label":"Battery","value":"7 Days"}]'),
  ('ESB-006','sample-buds-t300',      '[SAMPLE] Buds T300 True Wireless',    'Compact true wireless sample earbuds. Sample product.',                                             'accessories',      'Wave',   364900,   199900,  200, false, 2, 5, 320, '6 Months Warranty',      '[{"label":"Playback","value":"40 Hours"},{"label":"Water","value":"IPX4"}]'),
  ('ESB-007','sample-blendpro-mixer', '[SAMPLE] BlendPro 750W Mixer Grinder','Three-jar sample mixer grinder. Sample product.',                                                    'home-appliances',  'BlendPro',649900,  499900,  35, false, 4, 8, 44,  '2 Years Motor Warranty', '[{"label":"Power","value":"750W"},{"label":"Jars","value":"3"}]'),
  ('ESB-008','sample-pad-controller', '[SAMPLE] Pad One Wireless Controller','Wireless game controller sample. Sample product.',                                                  'gaming-zone',      'Pad',    599900,   499900,  0,  false, 3, 6, 70,  '1 Year Warranty',        '[{"label":"Connect","value":"Bluetooth"},{"label":"Battery","value":"30 Hours"}]'),
  ('ESB-009','sample-lens-r50',       '[SAMPLE] Lens R50 Mirrorless Camera', 'Mirrorless sample camera with kit lens. Sample product.',                                           'cameras',          'Lens',   7499900,  6499900, 12, true,  5, 9, 18,  '2 Years Warranty',       '[{"label":"Sensor","value":"24MP APS-C"},{"label":"Video","value":"4K 30fps"}]'),
  ('ESB-010','sample-vista-55-4k',    '[SAMPLE] Vista 55" 4K Smart TV',      '55-inch 4K sample smart TV. Sample product.',                                                       'tv-displays',      'Vista',  4999900,  3499900, 15, true,  5, 9, 26,  '1 Year Warranty',        '[{"label":"Screen","value":"55 inch 4K"},{"label":"Refresh","value":"60Hz"}]')
) as v(sku, slug, name, description, cat, brand, price, sale, stock, featured, dmin, dmax, sold, warranty, hl)
join public.categories c on c.slug = v.cat
on conflict (sku) do nothing;

-- ---------- options (shown as "Choose option" on the product page) ----------
insert into public.product_variants (product_id, label, size, finish, paper, price_delta_minor, position)
select p.id, v.label, v.storage, v.color, null, v.delta, v.pos
from (values
  ('ESB-001', '256GB / Black',   '256GB', 'Black',  0,      1),
  ('ESB-001', '512GB / Black',   '512GB', 'Black',  1000000,2),
  ('ESB-001', '512GB / Silver',  '512GB', 'Silver', 1000000,3),
  ('ESB-003', '16GB / 512GB',    '512GB', null,     0,      1),
  ('ESB-003', '16GB / 1TB',      '1TB',   null,     1200000,2),
  ('ESB-005', 'Black strap',     null,    'Black',  0,      1),
  ('ESB-005', 'Blue strap',      null,    'Blue',   0,      2)
) as v(sku, label, storage, color, delta, pos)
join public.products p on p.sku = v.sku
where not exists (select 1 from public.product_variants pv where pv.product_id = p.id and pv.label = v.label);

-- ---------- bulk pricing example ----------
insert into public.product_price_tiers (product_id, min_qty, unit_price_minor)
select p.id, v.minq, v.unit
from (values ('ESB-006', 3, 179900), ('ESB-006', 10, 159900)) as v(sku, minq, unit)
join public.products p on p.sku = v.sku
on conflict (product_id, min_qty) do nothing;

-- ---------- order options (off by default for electronics; turn on per product in Admin) ----------
insert into public.customization_fields (scope, key, label, help_text, field_type, is_required, max_length, extra_price_minor, position)
values
  ('global','gift_message','Gift message','Optional note to include in the parcel.','textarea', false, 150, 0, 1),
  ('global','order_note',  'Order note',  'Anything we should know?',               'textarea', false, 200, 0, 2)
on conflict do nothing;
