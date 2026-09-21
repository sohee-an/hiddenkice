# 히든카이스 스토어

히든카이스 교재 스토어 메인 화면. Supabase에 저장된 교재 목록을 클라이언트(CSR)에서 조회하고, 검색·유형 필터를 제공한다.

## 기술 스택

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 (Figma 디자인 토큰을 `@theme`으로 정의)
- Supabase (PostgreSQL + RLS)
- TanStack Query (CSR 데이터 조회·캐싱)

## 실행

```bash
npm install
cp .env.example .env.local   # Supabase URL, publishable key 입력
npm run dev
```

### Supabase 준비

Supabase 대시보드 SQL Editor에서 순서대로 실행한다.

1. `supabase/migrations/0001_create_products.sql` — 테이블 + RLS(조회만 허용)
2. `supabase/seed.sql` — 교재 더미 데이터

## 폴더 구조

```
src/
├─ app/                 # 라우팅과 페이지 조립만 담당
│  ├─ layout.tsx        # 폰트, Providers, Header/Footer
│  ├─ providers.tsx     # QueryClientProvider
│  ├─ page.tsx          # 스토어 메인 (Banner + ProductSection)
│  └─ globals.css       # 디자인 토큰
├─ features/            # 도메인 단위 모듈
│  ├─ product/
│  │  ├─ api/           # Supabase 조회 (DB row → 도메인 모델 변환)
│  │  ├─ hooks/         # useProducts(Query), useProductFilter(URL 동기화)
│  │  ├─ components/    # ProductSection, Toolbar, Grid, Card, Price
│  │  ├─ model/         # 타입, 라벨, 필터 옵션
│  │  └─ lib/           # 가격 포맷, 할인율 계산
│  └─ banner/
│     ├─ components/    # PromoBannerSlider
│     └─ data/          # 배너 목록
└─ shared/              # 도메인과 무관한 공용 코드
   ├─ layout/           # Header, Footer
   ├─ ui/               # SearchInput, SegmentedTabs, Skeleton
   ├─ hooks/            # useDebounce
   └─ lib/supabase/     # 브라우저용 Supabase 클라이언트
```

**의존 방향: `app → features → shared`** (역방향·feature 간 import 금지).
새 도메인(장바구니, 챌린지 등)은 `features/<도메인>`을 추가하는 것으로 확장하며 기존 코드는 수정하지 않는다.

## 데이터 흐름

```
ProductSection (client)
 ├─ useProductFilter  ─ URL ?q=&type= 와 동기화 (새로고침·공유 시 상태 유지), 검색어 300ms 디바운스
 └─ useProducts       ─ TanStack Query (queryKey: ['products','list',filter])
     └─ fetchProducts ─ supabase.from('products').ilike(title).eq(type)
```

- 검색·필터는 DB 쿼리로 처리해 데이터가 늘어나도 동일하게 동작하고, 페이지네이션 확장이 쉽다.
- 할인율은 저장하지 않고 `price`, `sale_price`로 계산해 데이터 불일치를 방지한다.
