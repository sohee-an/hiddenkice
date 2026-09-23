"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersect } from "@/shared/hooks/useIntersect";
import { productListQuery } from "../api/productService";
import { useProductFilter } from "../hooks/useProductFilter";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { ProductToolbar } from "./ProductToolbar";

const SECTION_CLASS =
  "mx-auto w-full max-w-content px-4 pt-[50px] pb-[50px] xl:px-0";

export function ProductSection() {
  const { filter, keywordInput, changeKeyword, setType } = useProductFilter();
  const {
    data,
    isPending,
    isError,
    isPlaceholderData,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery(productListQuery(filter));

  const products = data?.pages.flatMap((page) => page.items) ?? [];
  const loadMoreRef = useIntersect<HTMLDivElement>(() => fetchNextPage(), {
    enabled:
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetchNextPageError &&
      !isPlaceholderData,
  });

  return (
    <section
      aria-labelledby="product-section-title"
      className={SECTION_CLASS}
    >
      <h2 id="product-section-title" className="sr-only">
        교재 목록
      </h2>
      <ProductToolbar
        keyword={keywordInput}
        onKeywordChange={changeKeyword}
        type={filter.type}
        onTypeChange={setType}
      />

      <div
        className={`mt-9 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
        aria-busy={isPending || isPlaceholderData}
      >
        {isPending ? (
          <ProductGridSkeleton />
        ) : isError && !data ? (
          <StatusMessage
            message="교재 목록을 불러오지 못했습니다."
            action={{ label: "다시 시도", onClick: () => refetch() }}
          />
        ) : products.length === 0 ? (
          <StatusMessage
            message={
              filter.keyword
                ? `'${filter.keyword}'에 대한 검색 결과가 없습니다.`
                : "등록된 교재가 없습니다."
            }
          />
        ) : (
          <>
            <ProductGrid products={products} />
            {isFetchingNextPage && (
              <div className="mt-9">
                <ProductGridSkeleton />
              </div>
            )}
            {isFetchNextPageError ? (
              <StatusMessage
                message="교재를 더 불러오지 못했습니다."
                action={{ label: "다시 시도", onClick: () => fetchNextPage() }}
              />
            ) : (
              <div ref={loadMoreRef} aria-hidden className="h-px" />
            )}
          </>
        )}
      </div>
    </section>
  );
}

export function ProductSectionSkeleton() {
  return (
    <section aria-hidden className={SECTION_CLASS}>
      <div className="h-[42px]" />
      <div className="mt-9">
        <ProductGridSkeleton />
      </div>
    </section>
  );
}

function StatusMessage({
  message,
  action,
}: {
  message: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 py-24 text-body text-gray-300"
    >
      <p>{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="rounded-md border border-gray-100 px-4 py-2 text-body-sm text-gray-500 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
