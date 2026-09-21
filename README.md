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

Next.js는 프로젝트 파일 구성 방식을 강제하지 않고 몇 가지 전략을 제시한다. 이 중 **`app`은 라우팅 용도로만 두고, 애플리케이션 코드는 `app` 밖의 공용 폴더에 두는 방식**을 택했다. 그 위에 코드를 도메인 단위(`features`)와 도메인과 무관한 공용 코드(`shared`)로 나눴다.

```
hiddenkice/
├─ public/
│  ├─ icons/            # Figma에서 추출한 SVG 아이콘 (로고, 장바구니, 검색 등)
│  └─ images/           # 배너, 교재 표지 이미지
├─ supabase/
│  ├─ migrations/       # 테이블 + RLS 정책 SQL
│  └─ seed.sql          # 교재 더미 데이터
└─ src/  (아래)
```

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
   ├─ hooks/            # useDebouncedCallback
   └─ lib/supabase/     # 브라우저용 Supabase 클라이언트
```

| 폴더 | 역할 | 넣는 기준 |
|---|---|---|
| `app/` | 라우팅, 레이아웃, 페이지 조립 | Next.js 파일 규칙(`page`, `layout` 등)과 전역 설정만 둔다. 로직은 두지 않는다 |
| `features/<도메인>/` | 도메인별 UI·데이터 조회·타입·유틸 | 특정 도메인(교재, 배너)에만 쓰이는 코드 |
| `shared/` | 공용 레이아웃, UI 컴포넌트, 훅, 외부 서비스 클라이언트 | 어느 도메인에도 속하지 않고 여러 곳에서 재사용되는 코드 |

각 feature 안은 역할별로 나눈다.

- `api/` — 외부 데이터 조회. DB 컬럼(snake_case)을 도메인 모델(camelCase)로 변환해 컴포넌트가 DB 구조에 의존하지 않게 한다.
- `hooks/` — 조회(TanStack Query)와 상태(URL 동기화) 로직
- `components/` — 화면 컴포넌트
- `model/` — 타입과 상수(라벨, 필터 옵션)
- `lib/` — 순수 함수(가격 포맷, 할인율 계산)

**의존 방향: `app → features → shared`** (역방향·feature 간 import 금지).
새 도메인(장바구니, 챌린지 등)은 `features/<도메인>`을 추가하는 것으로 확장하며 기존 코드는 수정하지 않는다.

## 데이터 흐름

```
ProductSection (client)
 ├─ useProductFilter  ─ URL ?q=&type= 와 동기화 (새로고침·공유 시 상태 유지), 검색어 300ms 디바운스 후 URL 갱신, URL 변경 시 입력창도 동기화
 └─ useProducts       ─ TanStack Query (queryKey: ['products','list',filter])
     └─ fetchProducts ─ supabase.from('products').ilike(title).eq(type)
```

- 검색·필터는 DB 쿼리로 처리해 데이터가 늘어나도 동일하게 동작하고, 페이지네이션 확장이 쉽다.

## 디자인과 다른 부분: 할인율

Figma 시안의 패스 상품은 `정가 76,000원 / 5% / 64,800원`으로 표기되어 있으나, 세 값이 서로 맞지 않는다.

- 76,000원의 5% 할인가는 **72,200원**
- 64,800원은 76,000원 대비 약 **15%** 할인

할인율을 별도로 저장하면 이런 불일치가 데이터에 그대로 남을 수 있으므로, DB에는 **정가(`price`)와 할인가(`sale_price`)만 저장하고 할인율은 두 값으로 계산**하도록 했다(`features/product/lib/price.ts`). 그 결과 화면에는 시안의 5% 대신 **15%**가 표시된다.

## 모바일 대응 범위

모바일 시안이 따로 없어서, 레이아웃이 깨지지 않는 선까지만 대응했다. 헤더 메뉴 접기, 그리드 열 수 조정, 가로 넘침 방지가 그 범위다.
