"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "@/shared/hooks/useDebouncedCallback";
import {
  isProductTypeFilter,
  type ProductFilter,
  type ProductTypeFilter,
} from "../model/types";

/**
 * 검색어·타입 필터를 URL 쿼리(?q=&type=)와 동기화한다.
 * 새로고침하거나 링크를 공유해도 같은 목록이 보인다.
 *
 * - 입력창 → URL: 입력은 즉시 반영하고, URL(=조회 조건)은 300ms 디바운스 후 갱신
 * - URL → 입력창: 로고 클릭·뒤로가기 등으로 URL이 바뀌면 입력창을 URL에 맞춤
 */
export function useProductFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("q") ?? "";
  const rawType = searchParams.get("type");
  const type: ProductTypeFilter = isProductTypeFilter(rawType) ? rawType : "all";

  const [keywordInput, setKeywordInput] = useState(urlKeyword);

  // 직전 렌더의 URL 검색어와, 입력창에서 URL로 보낸 뒤 아직 반영되지 않은 검색어
  const [prevUrlKeyword, setPrevUrlKeyword] = useState(urlKeyword);
  const [pendingKeyword, setPendingKeyword] = useState<string | null>(null);

  if (urlKeyword !== prevUrlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    if (urlKeyword === pendingKeyword) {
      // 입력창에서 보낸 값이 반영된 것 → 그 사이 더 입력한 내용을 덮어쓰지 않는다
      setPendingKeyword(null);
    } else {
      // 외부에서 URL이 바뀐 것 → 입력창을 URL에 맞춘다
      setKeywordInput(urlKeyword);
    }
  }

  const updateParams = useCallback(
    (next: Partial<ProductFilter>) => {
      // 렌더 시점 값이 아닌 현재 URL을 기준으로 만들어, 연속 호출 시 앞선 변경이 사라지지 않게 한다
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
      // 네이티브 History API는 URL을 즉시 바꾸고 Next 라우터(useSearchParams)와 동기화된다.
      // 서버 요청 없이 URL만 바꾸면 되므로 router.replace 대신 사용한다.
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
