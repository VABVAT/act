insert into public.categories (id, name, slug, description)
values
  ('10000000-0000-0000-0000-000000000001', 'Festive Edit', 'festive-edit', 'Statement suits designed for intimate celebrations and elegant evenings.'),
  ('10000000-0000-0000-0000-000000000002', 'Everyday Grace', 'everyday-grace', 'Lightweight silhouettes for workdays, brunches, and effortless dressing.'),
  ('10000000-0000-0000-0000-000000000003', 'Wedding Guest', 'wedding-guest', 'Rich textures and luminous tones for celebratory dressing.')
on conflict (id) do nothing;

insert into public.products (
  id,
  category_id,
  name,
  slug,
  description,
  price,
  discounted_price,
  fabric,
  color,
  sku,
  delivery_information,
  return_policy,
  featured,
  is_active,
  popularity_score
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    'Rosewood Regal Suit Set',
    'rosewood-regal-suit-set',
    'A three-piece occasion suit with a softly flared kurta, tailored trousers, and a sheer dupatta finished with embroidered floral borders.',
    6299,
    5599,
    'Silk blend',
    'Rosewood pink',
    'ART-RRS-001',
    'Ships in 2-4 business days. Express shipping available in select metros.',
    'Exchange or return within 7 days if the garment is unworn and tags remain attached.',
    true,
    true,
    28
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Ivory Meher Anarkali',
    'ivory-meher-anarkali',
    'A softly layered anarkali with tonal embroidery and understated gold detailing, crafted for festive lunches and family celebrations.',
    5899,
    5199,
    'Chanderi cotton',
    'Ivory gold',
    'ART-IMA-002',
    'Ships in 2-4 business days with doorstep tracking.',
    'Exchange or return within 7 days if the garment is unworn and tags remain attached.',
    true,
    true,
    19
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    'Noor Teal Straight Suit',
    'noor-teal-straight-suit',
    'A polished straight-cut suit with delicate threadwork, breathable lining, and an easy silhouette designed for elevated daily wear.',
    4299,
    3899,
    'Cotton silk',
    'Deep teal',
    'ART-NTS-003',
    'Ships in 2-4 business days. Prepaid orders are prioritised.',
    'Exchange or return within 7 days if the garment is unworn and tags remain attached.',
    false,
    true,
    14
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000003',
    'Marigold Zari Celebration Set',
    'marigold-zari-celebration-set',
    'A festive sharara suit set with mirror-inspired embellishment, fluid drape, and a luminous dupatta for wedding-season dressing.',
    6899,
    6299,
    'Viscose silk',
    'Marigold ochre',
    'ART-MZS-004',
    'Ships in 3-5 business days due to finishing and quality checks.',
    'Exchange or return within 7 days if the garment is unworn and tags remain attached.',
    true,
    true,
    23
  )
on conflict (id) do nothing;

insert into public.product_images (product_id, image_url, alt_text, display_order, is_primary)
values
  ('20000000-0000-0000-0000-000000000001', '/catalog/rosewood-regal-main.svg', 'Rosewood Regal Suit Set full view', 0, true),
  ('20000000-0000-0000-0000-000000000001', '/catalog/rosewood-regal-detail.svg', 'Rosewood Regal Suit Set fabric detail', 1, false),
  ('20000000-0000-0000-0000-000000000002', '/catalog/ivory-meher-main.svg', 'Ivory Meher Anarkali full view', 0, true),
  ('20000000-0000-0000-0000-000000000002', '/catalog/ivory-meher-detail.svg', 'Ivory Meher Anarkali dupatta detail', 1, false),
  ('20000000-0000-0000-0000-000000000003', '/catalog/noor-teal-main.svg', 'Noor Teal Straight Suit full view', 0, true),
  ('20000000-0000-0000-0000-000000000003', '/catalog/noor-teal-detail.svg', 'Noor Teal Straight Suit close detail', 1, false),
  ('20000000-0000-0000-0000-000000000004', '/catalog/marigold-zari-main.svg', 'Marigold Zari Celebration Set full view', 0, true),
  ('20000000-0000-0000-0000-000000000004', '/catalog/marigold-zari-detail.svg', 'Marigold Zari Celebration Set dupatta detail', 1, false)
on conflict do nothing;

insert into public.product_sizes (product_id, size, quantity)
values
  ('20000000-0000-0000-0000-000000000001', 'S', 6),
  ('20000000-0000-0000-0000-000000000001', 'M', 8),
  ('20000000-0000-0000-0000-000000000001', 'L', 7),
  ('20000000-0000-0000-0000-000000000001', 'XL', 4),
  ('20000000-0000-0000-0000-000000000002', 'S', 5),
  ('20000000-0000-0000-0000-000000000002', 'M', 9),
  ('20000000-0000-0000-0000-000000000002', 'L', 6),
  ('20000000-0000-0000-0000-000000000002', 'XL', 4),
  ('20000000-0000-0000-0000-000000000003', 'S', 8),
  ('20000000-0000-0000-0000-000000000003', 'M', 10),
  ('20000000-0000-0000-0000-000000000003', 'L', 8),
  ('20000000-0000-0000-0000-000000000003', 'XL', 5),
  ('20000000-0000-0000-0000-000000000004', 'S', 4),
  ('20000000-0000-0000-0000-000000000004', 'M', 6),
  ('20000000-0000-0000-0000-000000000004', 'L', 5),
  ('20000000-0000-0000-0000-000000000004', 'XL', 3)
on conflict (product_id, size) do nothing;

insert into public.product_tags (product_id, tag)
values
  ('20000000-0000-0000-0000-000000000001', 'occasionwear'),
  ('20000000-0000-0000-0000-000000000001', 'embroidery'),
  ('20000000-0000-0000-0000-000000000002', 'anarkali'),
  ('20000000-0000-0000-0000-000000000002', 'festive'),
  ('20000000-0000-0000-0000-000000000003', 'straight-cut'),
  ('20000000-0000-0000-0000-000000000003', 'dailywear'),
  ('20000000-0000-0000-0000-000000000004', 'sharara'),
  ('20000000-0000-0000-0000-000000000004', 'wedding')
on conflict (product_id, tag) do nothing;

insert into public.coupons (
  id,
  code,
  description,
  discount_type,
  value,
  minimum_order_amount,
  maximum_discount_amount,
  usage_limit,
  starts_at,
  ends_at,
  is_active
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    'ARTEEZ10',
    '10% off on curated orders above Rs. 4,999.',
    'percentage',
    10,
    4999,
    800,
    250,
    timezone('utc', now()) - interval '1 day',
    timezone('utc', now()) + interval '180 days',
    true
  )
on conflict (id) do nothing;
