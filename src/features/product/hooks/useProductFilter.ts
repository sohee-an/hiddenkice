"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  isProductTypeFilter,
  type ProductFilter,
  type ProductTypeFilter,
} from "../model/types";

/**
 * 검색어·타입 필터를 URL 쿼리(?q=&type=)와 동기화한다.
 * 새로고침하거나 링크를 공유해도 같은 목록이 보인다.
 */
export function useProductFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("q") ?? "";
  const rawType = searchParams.get("type");
  const type: ProductTypeFilter = isProductTypeFilter(rawType) ? rawType : "all";

  // 입력창은 즉시 반영하고, URL(=조회 조건)은 디바운스 후 갱신
  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const debouncedKeyword = useDebounce(keywordInput, 300);

  const updateParams = useCallback(
    (next: Partial<ProductFilter>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.keyword !== undefined) {
        const keyword = next.keyword.trim();
        if (keyword) params.set("q", keyword);
        else params.delete("q");
      }
      if (next.type !== undefined) {
        if (next.type === "all") params.delete("type");
        else params.set("type", next.type);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (debouncedKeyword.trim() !== urlKeyword) {
      updateParams({ keyword: debouncedKeyword });
    }
  }, [debouncedKeyword, urlKeyword, updateParams]);

  const setType = useCallback(
    (nextType: ProductTypeFilter) => updateParams({ type: nextType }),
    [updateParams],
  );

  const filter: ProductFilter = { keyword: urlKeyword, type };

  return { filter, keywordInput, setKeywordInput, setType };
}
