-- 교재 더미 데이터 (Figma 그리드 순서와 동일하게 created_at을 1분 간격으로 지정)
truncate table public.products;

insert into public.products (title, type, price, sale_price, image_url, created_at) values
  ('2026 Hidden Kice 시즌7',        'single', 40000, null,  '/images/book-cover.png', now() - interval '12 minutes'),
  ('2026 Hidden Kice 시즌7',        'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '11 minutes'),
  ('2026 Hidden Kice 시즌6',        'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '10 minutes'),
  ('2026 Hidden Kice 시즌5',        'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '9 minutes'),
  ('2026 Hidden Kice 파이널',       'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '8 minutes'),
  ('2026 Hidden Kice 시즌4',        'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '7 minutes'),
  ('2026 Hidden Kice 시즌6',        'single', 40000, null,  '/images/book-cover.png', now() - interval '6 minutes'),
  ('2026 Hidden Kice 시즌3',        'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '5 minutes'),
  ('2026 Hidden Kice 시즌5',        'single', 40000, null,  '/images/book-cover.png', now() - interval '4 minutes'),
  ('2026 Hidden Kice 시즌2',        'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '3 minutes'),
  ('2026 Hidden Kice 시즌1',        'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '2 minutes'),
  ('2026 Hidden Kice 파이널 모의고사', 'pass',   76000, 64800, '/images/book-pass.png',  now() - interval '1 minute');
