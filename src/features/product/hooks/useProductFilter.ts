"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "@/shared/hooks/useDebouncedCallback";
import {
  DEFAULT_PRODUCT_TYPE_FILTER,
  isProductTypeFilter,
  type ProductFilter,
  type ProductTypeFilter,
} from "../model/types";

const FILTER_PARAMS: Record<
  keyof ProductFilter,
  { param: string; defaultValue: string }
> = {
  keyword: { param: "q", defaultValue: "" },
  type: { param: "type", defaultValue: DEFAULT_PRODUCT_TYPE_FILTER },
};

export function useProductFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword =
    searchParams.get(FILTER_PARAMS.keyword.param) ?? FILTER_PARAMS.keyword.defaultValue;
  const rawType = searchParams.get(FILTER_PARAMS.type.param);
  const type: ProductTypeFilter = isProductTypeFilter(rawType)
    ? rawType
    : DEFAULT_PRODUCT_TYPE_FILTER;

  const [keywordInput, setKeywordInput] = useState(urlKeyword);

  const [prevUrlKeyword, setPrevUrlKeyword] = useState(urlKeyword);
  const [pendingKeyword, setPendingKeyword] = useState<string | null>(null);

  if (urlKeyword !== prevUrlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    if (urlKeyword === pendingKeyword) {
      setPendingKeyword(null);
    } else {
      setKeywordInput(urlKeyword);
    }
  }

  const updateParams = useCallback(
    (next: Partial<ProductFilter>) => {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(next)) {
        if (value === undefined) continue;
        const { param, defaultValue } = FILTER_PARAMS[key as keyof ProductFilter];
        const trimmed = value.trim();
        if (!trimmed || trimmed === defaultValue) params.delete(param);
        else params.set(param, trimmed);
      }
      const query = params.toString();
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname],
  );

  const syncKeywordToUrl = useDebouncedCallback((keyword: string) => {
    const trimmed = keyword.trim();
    const current =
      new URLSearchParams(window.location.search).get(FILTER_PARAMS.keyword.param) ??
      FILTER_PARAMS.keyword.defaultValue;
    if (trimmed === current) return;
    setPendingKeyword(trimmed);
    updateParams({ keyword: trimmed });
  }, 300);

  const changeKeyword = useCallback(
    (keyword: string) => {
      setKeywordInput(keyword);
      syncKeywordToUrl(keyword);
    },
    [syncKeywordToUrl],
  );

  const setType = useCallback(
    (nextType: ProductTypeFilter) => updateParams({ type: nextType }),
    [updateParams],
  );

  const filter: ProductFilter = { keyword: urlKeyword, type };

  return { filter, keywordInput, changeKeyword, setType };
}
