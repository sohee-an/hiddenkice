-- 교재(상품) 테이블
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  type        text        not null check (type in ('single', 'pass')),
  price       integer     not null check (price >= 0),
  -- 할인가. null이면 할인 없음. 할인율은 클라이언트에서 price 대비 계산
  sale_price  integer     check (sale_price is null or (sale_price >= 0 and sale_price <= price)),
  image_url   text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists products_type_idx on public.products (type);
create index if not exists products_created_at_idx on public.products (created_at);

-- RLS: 익명(anon) 사용자는 조회만 허용
alter table public.products enable row level security;

drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
  on public.products
  for select
  to anon, authenticated
  using (true);
