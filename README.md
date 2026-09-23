# 히든카이스 스토어

히든카이스 교재 스토어 메인 화면. Supabase에 저장된 교재 목록을 클라이언트(CSR)에서 조회하고, 검색·유형 필터를 제공한다.

- 배포: https://hiddenkice.vercel.app/
- 저장소: https://github.com/sohee-an/hiddenkice

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
2. `supabase/seed.sql` — 교재 더미 데이터 36개

## 폴더 구조

Next.js는 프로젝트 파일 구성 방식을 강제하지 않고 몇 가지 전략을 제시한다. 이 중 **`app`은 라우팅 용도로만 두고, 애플리케이션 코드는 `app` 밖의 공용 폴더에 두는 방식**을 택했다. 그 위에 코드를 도메인 기능(`features`), 도메인 모델(`entities`), 도메인과 무관한 공용 코드(`shared`)로 나눴다.

```
hiddenkice/
├─ public/
│  ├─ icons/            # Figma에서 추출한 SVG 아이콘 (로고, 장바구니, 검색 등)
│  └─ images/           # 배너, 교재 표지 이미지
├─ supabase/
│  ├─ migrations/       # 테이블 + RLS 정책 SQL
│  └─ seed.sql          # 교재 더미 데이터 36개
└─ src/  (아래)
```

```
src/
├─ app/                 # 라우팅과 페이지 조립만 담당
│  ├─ _components/      # Header, Footer, MobileNavMenu (루트 레이아웃 전용, 라우팅 제외)
│  ├─ layout.tsx        # 폰트, Providers, Header/Footer
│  ├─ providers.tsx     # QueryClientProvider
│  ├─ page.tsx          # 스토어 메인 (Banner + ProductSection)
│  ├─ error.tsx         # 라우트 에러 경계
│  ├─ global-error.tsx  # 루트 레이아웃 실패 시
│  ├─ not-found.tsx     # 404
│  └─ globals.css       # 디자인 토큰
├─ features/            # 도메인 단위 모듈
│  ├─ product/
│  │  ├─ index.ts       # 공개 진입점 (app은 여기서만 import)
│  │  ├─ api/           # Supabase 조회 + query key·옵션 (productService)
│  │  ├─ hooks/         # useProductFilter(URL 동기화)
│  │  ├─ components/    # ProductSection, Toolbar, Grid, Card, Price
│  │  ├─ model/         # 이 도메인 전용 타입(필터, 페이지)
│  │  └─ lib/           # 가격 포맷, 할인율 계산
│  └─ banner/
│     ├─ index.ts       # 공개 진입점
│     ├─ components/    # PromoBannerSlider
│     └─ data/          # 배너 목록
├─ entities/            # 여러 도메인이 공유하는 도메인 모델
│  └─ product/
│     ├─ index.ts       # 공개 진입점
│     └─ model/         # Product, ProductType, 타입 라벨
└─ shared/              # 도메인과 무관한 공용 코드
   ├─ ui/               # SearchInput, SegmentedTabs, Skeleton
   ├─ hooks/            # useDebouncedCallback, useIntersect, usePrefersReducedMotion
   └─ lib/supabase/     # 브라우저용 Supabase 클라이언트
```

- `app/` — 라우팅·레이아웃·조립만. 앱 전용 레이아웃(Header, Footer)은 private folder `_components`에 둔다.
- `features/<도메인>/` — 특정 도메인(교재, 배너)에만 쓰이는 UI·조회·유틸.
- `entities/<도메인>/` — 여러 도메인이 함께 쓰는 도메인 모델. 예: 장바구니·주문이 함께 쓸 `Product`.
- `shared/` — 도메인을 모르는 공용 UI·훅·외부 서비스 클라이언트.

각 feature 안은 역할별로 나눈다.

- `api/` — 외부 데이터 조회와 query key·옵션. DB 컬럼(snake_case)을 도메인 모델(camelCase)로 변환해 컴포넌트가 DB 구조에 의존하지 않게 한다.
- `hooks/` — 상태 로직(URL 동기화). 조회는 `api/`의 query 옵션을 화면에서 그대로 쓰고, 추가 로직이 있을 때만 훅을 만든다.
- `components/` — 화면 컴포넌트
- `model/` — 이 도메인 전용 타입과 상수(필터 옵션 등)
- `lib/` — 순수 함수(가격 포맷, 할인율 계산)

**의존 방향: `app → features → entities → shared`** (역방향·feature 간 import 금지). 이 규칙은 `eslint.config.mjs`의 `no-restricted-imports`로 강제한다.

- `app`은 내부 파일이 아닌 공개 진입점(`@/features/<도메인>`, `@/entities/<도메인>`)으로만 import한다.
- feature는 다른 feature와 `app`을 import할 수 없다. 공유해야 할 도메인 모델은 `entities`로 올린다.
- `entities`는 `app`, `features`를 import할 수 없다.
- `shared`는 `app`, `features`, `entities`를 import할 수 없다. 도메인을 모르는 코드만 둔다.

새 도메인(장바구니, 챌린지 등)은 `features/<도메인>`을 추가하는 것으로 확장한다. 두 도메인이 같은 모델을 필요로 할 때만 그 타입을 `entities/<도메인>`으로 올린다.

## 데이터 흐름

```
ProductSection (client)
 ├─ useProductFilter  ─ URL ?q=&type= 와 동기화 (새로고침·공유 시 상태 유지), 검색어 300ms 디바운스 후 URL 갱신, URL 변경 시 입력창도 동기화
 ├─ useInfiniteQuery(productListQuery(filter))
 │   ├─ productKeys.list(filter) ─ ['products','list',filter]
 │   └─ productService.getList   ─ supabase.from('products').ilike(title).eq(type).range(from, to)
 └─ useIntersect      ─ 목록 끝 센서가 화면에 들어오면 fetchNextPage()
```

- 검색·필터는 DB 쿼리로 처리해 데이터가 늘어나도 같은 결과를 준다. 다만 부분 일치 검색(`ilike '%키워드%'`)은 선행 와일드카드라 인덱스를 타지 못하므로, 수만 건 규모가 되면 `pg_trgm` GIN 인덱스나 전문 검색으로 전환해야 한다.
- 목록은 12개씩 불러오는 무한 스크롤이다. 첫 화면은 Figma와 같은 12개이고, 스크롤하면 다음 12개를 이어서 불러온다.
- 다음 페이지 여부는 13개(`PAGE_SIZE + 1`)를 요청해 판단하므로 전체 개수를 세는 추가 쿼리가 없다. 정렬은 `created_at`, `id` 순으로 고정해 정렬 순서가 매번 달라져 생기는 중복·누락을 막는다. 다만 offset 방식이라 스크롤 도중 앞쪽에 교재가 추가·삭제되면 경계에서 중복·누락이 날 수 있다. 이를 완전히 막으려면 마지막 행의 `(created_at, id)`를 커서로 쓰는 keyset 방식이어야 한다.
- 검색어·유형이 바뀌면 query key가 바뀌어 첫 페이지부터 다시 불러온다. 이전 요청은 `AbortSignal`로 취소된다.
- query key와 query 옵션은 `"use client"`가 없는 `api/productService.ts`에 두어, 서버 컴포넌트도 같은 key를 쓸 수 있게 했다. 다만 과제 요구사항이 CSR이므로 서버 프리페치는 적용하지 않았다.

## 품질

### 에러 처리

실패한 범위만큼만 화면을 대체하도록 세 층으로 나눴다.

| 층 | 담당 | 화면 |
|---|---|---|
| `ProductSection`의 `isError` | 교재 목록 조회 실패 | 목록 자리에만 메시지 + 다시 시도 |
| `app/error.tsx` | 렌더 중 발생한 예외 | Header/Footer는 유지, 본문만 대체 (`reset()`으로 재시도) |
| `app/global-error.tsx` | 루트 레이아웃 자체의 실패 | 페이지 전체. `layout.tsx`를 대체하므로 `html`/`body`를 직접 그리고, 폰트·토큰이 없을 수 있어 인라인 스타일만 쓴다 |

데이터 조회 실패는 예외가 아니라 TanStack Query의 `isError`로 돌아오므로 에러 경계가 잡지 않는다. 화면 일부의 데이터 실패로 페이지 전체를 에러 화면으로 바꾸지 않기 위해 목록 영역에서 직접 처리한다.

전역 에러 수집 도구는 아직 붙이지 않았고, `console.error`로 남긴다. 서버 로그와 대조할 수 있도록 `error.tsx`는 `digest`를 함께 표시한다.

### 접근성

- **배너 자동 전환** — 5초마다 넘어가므로 일시정지 버튼을 뒀다(WCAG 2.2.2). 마우스 호버로 인한 정지와 사용자가 누른 정지를 구분해, 마우스를 떼도 사용자가 멈춘 상태는 유지된다.
- **동작 줄이기** — OS에서 `prefers-reduced-motion: reduce`를 켜면 배너 자동 전환과 전환 애니메이션을 하지 않는다. 화살표로 직접 넘기는 것은 그대로 동작한다. 미디어 쿼리는 `useSyncExternalStore`로 구독해 SSR에서도 안전하고 설정 변경이 즉시 반영된다(`shared/hooks/usePrefersReducedMotion.ts`).
- **가격 정보** — 정가·할인율·판매가에 숨김 텍스트를 붙여 스크린리더가 세 값을 구분해 읽도록 했다. 정가는 `<del>`로 표기한다.
- **필터와 검색** — 유형 필터 버튼은 `aria-pressed`로 선택 상태를 알린다. 검색어 지우기(X) 버튼은 누르면 숨겨지므로, 지운 뒤 입력창으로 포커스를 되돌려 키보드 흐름이 끊기지 않게 했다.
- **포커스 표시** — 버튼에 `focus-visible` 윤곽선을 둬 키보드 사용자가 현재 위치를 알 수 있다.

### SEO

메타데이터는 `layout.tsx`에서 정적으로 제공한다. 제목·설명·OG·트위터 카드와 1200×630 OG 이미지, `lang="ko"`, `<h1>`이 초기 HTML에 포함되므로 페이지 색인과 링크 공유 미리보기는 정상 동작한다. 여기에 `robots.ts`(크롤링 허용 + 사이트맵 위치)와 `sitemap.ts`를 두었고, 프리뷰 배포 URL이 따로 색인되지 않도록 canonical을 지정했다. 주소·이름·설명은 `siteConfig.ts` 한 곳에서 관리해 metadata와 robots·sitemap이 어긋나지 않게 했다.

**다만 교재 목록은 초기 HTML에 없다.** 요구사항이 CSR이라 목록을 브라우저에서 조회하기 때문이다. 그 결과 상품명·가격이 HTML에 포함되지 않아, "히든카이스 스토어" 같은 사이트 단위 검색에는 노출되지만 **개별 교재명으로는 검색 유입이 되지 않는다.** 구글은 JS를 실행해 뒤늦게 색인하지만 지연이 생기고, 네이버는 JS 실행이 제한적이라 사실상 읽지 못한다.

전환이 필요해지면 목록만 서버에서 미리 받아오면 된다. query key와 옵션을 `"use client"`가 없는 `api/productService.ts`에 두었고 `useSearchParams`를 위한 Suspense 경계도 이미 잡혀 있으므로, `page.tsx`에서 `prefetchInfiniteQuery` 호출과 `HydrationBoundary`를 추가하는 선에서 끝난다. 교재 상세 페이지를 만든다면 그 페이지는 서버에서 데이터를 받아 `generateMetadata`와 `Product` 구조화 데이터(JSON-LD)를 함께 제공하는 것이 다음 단계다.

### 규칙 강제와 테스트

**`next build`는 TypeScript만 검사하고 ESLint는 실행하지 않는다.** 따라서 위 폴더 구조의 import 규칙을 어긴 코드도 빌드를 통과해 배포될 수 있다. 규칙이 실제로 강제되도록 두 지점에서 검사한다.

| 시점 | 도구 | 검사 |
|---|---|---|
| 커밋 전 | husky + lint-staged | 변경된 파일만 `eslint --fix` (빠른 피드백) |
| PR·main push | GitHub Actions (`.github/workflows/ci.yml`) | `eslint` → `next typegen` → `tsc --noEmit` → 단위 테스트 |

CI의 `verify` 체크는 main 브랜치 보호 규칙의 필수 조건이라, 통과하지 못하면 머지할 수 없다. 커밋 훅은 `--no-verify`로 건너뛸 수 있으므로 실제 방어선은 CI 쪽이다.

타입 검사 전에는 `next typegen`을 먼저 실행한다. `LayoutProps` 등 Next가 빌드 과정에서 생성하는 라우트 타입이 없으면 `tsc`가 실패하기 때문이다.

테스트는 `useProductFilter`부터 붙였다(Vitest + jsdom, `npm test`). 이 훅이 검색어 디바운스, URL 동기화, 외부 URL 변경 대응을 한꺼번에 다루는 가장 복잡한 지점이라 회귀가 나도 눈으로 잡기 어렵기 때문이다. 디바운스 경계(299ms에는 URL이 그대로, 300ms에 갱신), 연속 입력 시 마지막 값만 반영, 기본값(`all`·빈 문자열)일 때 파라미터 제거, 자신이 만든 URL 변경으로는 입력창을 덮어쓰지 않는 분기를 확인한다.

배포(CD)는 별도로 만들지 않고 Vercel의 Git 연동을 그대로 쓴다. 직접 파이프라인을 구성하면 PR별 프리뷰 배포를 잃고 얻는 것이 없다고 판단했다.

## 설계 판단

### 할인율 — 시안 값의 모순

Figma 시안의 패스 상품은 `정가 76,000원 / 5% / 64,800원`으로 표기되어 있으나, 세 값이 서로 맞지 않는다.

- 76,000원의 5% 할인가는 **72,200원**
- 64,800원은 76,000원 대비 약 **15%** 할인

할인율을 별도로 저장하면 이런 불일치가 데이터에 그대로 남을 수 있으므로, DB에는 **정가(`price`)와 할인가(`sale_price`)만 저장하고 할인율은 두 값으로 계산**하도록 했다(`features/product/lib/price.ts`). 그 결과 화면에는 시안의 5% 대신 **15%**가 표시된다.

### 상품명 줄 수

Figma 시안에는 상품명이 길어졌을 때의 처리 규칙이 정의되어 있지 않다. 목록에서 상품명은 사용자가 상품을 구분하는 가장 중요한 정보라고 판단해 **2줄까지 표시**하도록 했다(`line-clamp-2`). 제목 영역은 2줄 높이를 항상 확보해 카드마다 가격 위치가 어긋나지 않게 했고, 2줄을 넘어가면 말줄임표로 처리하되 마우스를 올리면 전체 제목이 보이도록 `title` 속성을 두었다.

줄 수 기준이 달라지면 `features/product/components/ProductCard.tsx`의 `line-clamp-*`와 높이 확보 값만 바꾸면 된다.

### 모바일 대응 범위

모바일 시안이 따로 없어서, 레이아웃이 깨지지 않는 선까지만 대응했다. 헤더 메뉴 접기, 그리드 열 수 조정, 가로 넘침 방지가 그 범위다.

모바일 전용 UI는 설계하지 않았다. 시안이 없는 상태에서 새 화면을 만드는 것은 임의 판단이 되기 때문이다. 다만 데스크톱에 있는 기능이 터치에서 닿지 않는 경우는 접근 가능하게 맞췄다. 배너 좌우 화살표가 호버로만 보이던 것을 작은 화면에서는 항상 보이게 한 것이 그 예다. 스와이프 제스처처럼 모바일 고유의 인터랙션은 추가하지 않았다.
