"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/fetchProducts";
import type { ProductFilter } from "../model/types";

export const productKeys = {
  all: ["products"] as const,
  list: (filter: ProductFilter) =>
    [...productKeys.all, "list", filter] as const,
};

export function useProducts(filter: ProductFilter) {
  return useInfiniteQuery({
    queryKey: productKeys.list(filter),
    queryFn: ({ pageParam }) => fetchProducts(filter, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    placeholderData: keepPreviousData,
  });
}
