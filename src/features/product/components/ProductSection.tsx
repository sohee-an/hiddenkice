"use client";

import { useProductFilter } from "../hooks/useProductFilter";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { ProductToolbar } from "./ProductToolbar";

export function ProductSection() {
  const { filter, keywordInput, setKeywordInput, setType } = useProductFilter();
  const { data, isPending, isError, isPlaceholderData, refetch } =
    useProducts(filter);

  return (
    <section
      aria-labelledby="product-section-title"
      className="mx-auto w-full max-w-content px-4 pt-[50px] pb-[50px] xl:px-0"
    >
      <h2 id="product-section-title" className="sr-only">
        교재 목록
      </h2>
      <ProductToolbar
        keyword={keywordInput}
        onKeywordChange={setKeywordInput}
        type={filter.type}
        onTypeChange={setType}
      />

      <div
        className={`mt-9 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
        aria-busy={isPending || isPlaceholderData}
      >
        {isPending ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <StatusMessage
            message="교재 목록을 불러오지 못했습니다."
            action={{ label: "다시 시도", onClick: () => refetch() }}
          />
        ) : data.length === 0 ? (
          <StatusMessage
            message={
              filter.keyword
                ? `'${filter.keyword}'에 대한 검색 결과가 없습니다.`
                : "등록된 교재가 없습니다."
            }
          />
        ) : (
          <ProductGrid products={data} />
        )}
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
          className="rounded-md border border-gray-100 px-4 py-2 text-body-sm text-gray-500 hover:border-primary hover:text-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
