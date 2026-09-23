import {
  PRODUCT_TYPE_LABEL,
  type Product,
  type ProductType,
} from "@/entities/product";

export type ProductPage = {
  items: Product[];
  nextPage: number | null;
};

export type ProductTypeFilter = ProductType | "all";

export type ProductFilter = {
  keyword: string;
  type: ProductTypeFilter;
};

export const PRODUCT_TYPE_FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "pass", label: PRODUCT_TYPE_LABEL.pass },
  { value: "single", label: PRODUCT_TYPE_LABEL.single },
] as const satisfies readonly { value: ProductTypeFilter; label: string }[];

export const DEFAULT_PRODUCT_TYPE_FILTER = "all" satisfies ProductTypeFilter;

export function isProductTypeFilter(value: unknown): value is ProductTypeFilter {
  return PRODUCT_TYPE_FILTER_OPTIONS.some((option) => option.value === value);
}
