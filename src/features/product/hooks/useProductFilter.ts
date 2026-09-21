"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "@/shared/hooks/useDebouncedCallback";
import {
  isProductTypeFilter,
  type ProductFilter,
  type ProductTypeFilter,
} from "../model/types";

export function useProductFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("q") ?? "";
  const rawType = searchParams.get("type");
  const type: ProductTypeFilter = isProductTypeFilter(rawType) ? rawType : "all";

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
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname],
  );

  const syncKeywordToUrl = useDebouncedCallback((keyword: string) => {
    const trimmed = keyword.trim();
    const current = new URLSearchParams(window.location.search).get("q") ?? "";
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
