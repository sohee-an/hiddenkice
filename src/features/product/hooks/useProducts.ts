"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/fetchProducts";
import type { ProductFilter } from "../model/types";

export const productKeys = {
  all: ["products"] as const,
  list: (filter: ProductFilter) =>
    [...productKeys.all, "list", filter] as const,
};

export function useProducts(filter: ProductFilter) {
  return useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => fetchProducts(filter),
    // 검색어/탭이 바뀌는 동안 이전 목록을 유지해 화면 깜빡임 방지
    placeholderData: keepPreviousData,
  });
}
