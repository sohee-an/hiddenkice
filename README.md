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
   ├─ hooks/            # useDebouncedCallback, useIntersect(IntersectionObserver)
   └─ lib/supabase/     # 브라우저용 Supabase 클라이언트
```

| 폴더 | 역할 | 넣는 기준 |
|---|---|---|
| `app/` | 라우팅, 레이아웃, 페이지 조립 | Next.js 파일 규칙(`page`, `layout` 등)과 전역 설정만 둔다. 앱 전용 레이아웃(Header, Footer)은 private folder `_components`에 둔다 |
| `features/<도메인>/` | 도메인별 UI·데이터 조회·유틸 | 특정 도메인(교재, 배너)에만 쓰이는 코드 |
| `entities/<도메인>/` | 도메인 모델(타입, 라벨) | 여러 도메인이 함께 쓰는 도메인 지식. 예: 장바구니·주문이 함께 쓰는 `Product` |
| `shared/` | UI 컴포넌트, 훅, 외부 서비스 클라이언트 | 어느 도메인에도 속하지 않고 여러 곳에서 재사용되는 코드 |

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

- 검색·필터는 DB 쿼리로 처리해 데이터가 늘어나도 동일하게 동작한다.
- 목록은 12개씩 불러오는 무한 스크롤이다. 첫 화면은 Figma와 같은 12개이고, 스크롤하면 다음 12개를 이어서 불러온다.
- 다음 페이지 여부는 13개(`PAGE_SIZE + 1`)를 요청해 판단하므로 전체 개수를 세는 추가 쿼리가 없다. 정렬은 `created_at`, `id` 순으로 고정해 페이지 사이 중복·누락을 막는다.
- 검색어·유형이 바뀌면 query key가 바뀌어 첫 페이지부터 다시 불러온다. 이전 요청은 `AbortSignal`로 취소된다.
- query key와 query 옵션은 `"use client"`가 없는 `api/productService.ts`에 두어, 서버 컴포넌트도 같은 key를 쓸 수 있게 했다. 다만 과제 요구사항이 CSR이므로 서버 프리페치는 적용하지 않았다.

## 에러 처리

실패한 범위만큼만 화면을 대체하도록 세 층으로 나눴다.

| 층 | 담당 | 화면 |
|---|---|---|
| `ProductSection`의 `isError` | 교재 목록 조회 실패 | 목록 자리에만 메시지 + 다시 시도 |
| `app/error.tsx` | 렌더 중 발생한 예외 | Header/Footer는 유지, 본문만 대체 (`reset()`으로 재시도) |
| `app/global-error.tsx` | 루트 레이아웃 자체의 실패 | 페이지 전체. `layout.tsx`를 대체하므로 `html`/`body`를 직접 그리고, 폰트·토큰이 없을 수 있어 인라인 스타일만 쓴다 |

데이터 조회 실패는 예외가 아니라 TanStack Query의 `isError`로 돌아오므로 에러 경계가 잡지 않는다. 화면 일부의 데이터 실패로 페이지 전체를 에러 화면으로 바꾸지 않기 위해 목록 영역에서 직접 처리한다.

전역 에러 수집 도구는 아직 붙이지 않았고, `console.error`로 남긴다. 서버 로그와 대조할 수 있도록 `error.tsx`는 `digest`를 함께 표시한다.

## 접근성

- **배너 자동 전환** — 5초마다 넘어가므로 일시정지 버튼을 뒀다(WCAG 2.2.2). 마우스 호버로 인한 정지와 사용자가 누른 정지를 구분해, 마우스를 떼도 사용자가 멈춘 상태는 유지된다.
- **동작 줄이기** — OS에서 `prefers-reduced-motion: reduce`를 켜면 배너 자동 전환과 전환 애니메이션을 하지 않는다. 화살표로 직접 넘기는 것은 그대로 동작한다. 미디어 쿼리는 `useSyncExternalStore`로 구독해 SSR에서도 안전하고 설정 변경이 즉시 반영된다(`shared/hooks/usePrefersReducedMotion.ts`).
- **가격 정보** — 정가·할인율·판매가에 숨김 텍스트를 붙여 스크린리더가 세 값을 구분해 읽도록 했다. 정가는 `<del>`로 표기한다.
- **필터와 검색** — 유형 필터 버튼은 `aria-pressed`로 선택 상태를 알린다. 검색어 지우기(X) 버튼은 누르면 숨겨지므로, 지운 뒤 입력창으로 포커스를 되돌려 키보드 흐름이 끊기지 않게 했다.
- **포커스 표시** — 버튼에 `focus-visible` 윤곽선을 둬 키보드 사용자가 현재 위치를 알 수 있다.

## 품질 관리

**`next build`는 TypeScript만 검사하고 ESLint는 실행하지 않는다.** 따라서 위 폴더 구조의 import 규칙을 어긴 코드도 빌드를 통과해 배포될 수 있다. 규칙이 실제로 강제되도록 두 지점에서 검사한다.

| 시점 | 도구 | 검사 |
|---|---|---|
| 커밋 전 | husky + lint-staged | 변경된 파일만 `eslint --fix` (빠른 피드백) |
| PR·main push | GitHub Actions (`.github/workflows/ci.yml`) | `eslint` 전체 + `tsc --noEmit` |

CI의 `verify` 체크는 main 브랜치 보호 규칙의 필수 조건이라, 통과하지 못하면 머지할 수 없다. 커밋 훅은 `--no-verify`로 건너뛸 수 있으므로 실제 방어선은 CI 쪽이다.

타입 검사 전에는 `next typegen`을 먼저 실행한다. `LayoutProps` 등 Next가 빌드 과정에서 생성하는 라우트 타입이 없으면 `tsc`가 실패하기 때문이다.

배포(CD)는 별도로 만들지 않고 Vercel의 Git 연동을 그대로 쓴다. 직접 파이프라인을 구성하면 PR별 프리뷰 배포를 잃고 얻는 것이 없다고 판단했다.

## 디자인과 다른 부분: 할인율

Figma 시안의 패스 상품은 `정가 76,000원 / 5% / 64,800원`으로 표기되어 있으나, 세 값이 서로 맞지 않는다.

- 76,000원의 5% 할인가는 **72,200원**
- 64,800원은 76,000원 대비 약 **15%** 할인

할인율을 별도로 저장하면 이런 불일치가 데이터에 그대로 남을 수 있으므로, DB에는 **정가(`price`)와 할인가(`sale_price`)만 저장하고 할인율은 두 값으로 계산**하도록 했다(`features/product/lib/price.ts`). 그 결과 화면에는 시안의 5% 대신 **15%**가 표시된다.

## 상품명 줄 수

Figma 시안에는 상품명이 길어졌을 때의 처리 규칙이 정의되어 있지 않다. 목록에서 상품명은 사용자가 상품을 구분하는 가장 중요한 정보라고 판단해 **2줄까지 표시**하도록 했다(`line-clamp-2`). 제목 영역은 2줄 높이를 항상 확보해 카드마다 가격 위치가 어긋나지 않게 했고, 2줄을 넘어가면 말줄임표로 처리하되 마우스를 올리면 전체 제목이 보이도록 `title` 속성을 두었다.

줄 수 기준이 달라지면 `features/product/components/ProductCard.tsx`의 `line-clamp-*`와 높이 확보 값만 바꾸면 된다.

## 모바일 대응 범위

모바일 시안이 따로 없어서, 레이아웃이 깨지지 않는 선까지만 대응했다. 헤더 메뉴 접기, 그리드 열 수 조정, 가로 넘침 방지가 그 범위다.
