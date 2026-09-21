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
    placeholderData: keepPreviousData,
  });
}
