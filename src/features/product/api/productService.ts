import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import type { Product, ProductType } from "@/entities/product";
import { getSupabaseClient } from "@/shared/lib/supabase/client";
import type { ProductFilter, ProductPage } from "../model/types";

export const PRODUCT_PAGE_SIZE = 12;

type ProductRow = {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  sale_price: number | null;
  image_url: string;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    price: row.price,
    salePrice: row.sale_price,
    imageUrl: row.image_url,
  };
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export const productService = {
  getList: async (
    { keyword, type }: ProductFilter,
    page: number,
    signal?: AbortSignal,
  ): Promise<ProductPage> => {
    const from = page * PRODUCT_PAGE_SIZE;

    let query = getSupabaseClient()
      .from("products")
      .select("id, title, type, price, sale_price, image_url")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PRODUCT_PAGE_SIZE);

    const trimmed = keyword.trim();
    if (trimmed) {
      query = query.ilike("title", `%${escapeLikePattern(trimmed)}%`);
    }
    if (type !== "all") {
      query = query.eq("type", type);
    }
    if (signal) {
      query = query.abortSignal(signal);
    }

    const { data, error } = await query.overrideTypes<
      ProductRow[],
      { merge: false }
    >();
    if (error) throw new Error(error.message);

    const hasNext = data.length > PRODUCT_PAGE_SIZE;
    return {
      items: data.slice(0, PRODUCT_PAGE_SIZE).map(toProduct),
      nextPage: hasNext ? page + 1 : null,
    };
  },
};

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export const productListQuery = (filter: ProductFilter) =>
  infiniteQueryOptions({
    queryKey: productKeys.list(filter),
    queryFn: ({ pageParam, signal }) =>
      productService.getList(filter, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    placeholderData: keepPreviousData,
  });
