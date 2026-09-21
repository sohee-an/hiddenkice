export type ProductType = "single" | "pass";

export type Product = {
  id: string;
  title: string;
  type: ProductType;
  /** 정가 */
  price: number;
  /** 할인가. null이면 할인 없음 */
  salePrice: number | null;
  imageUrl: string;
};

/** 목록 필터. "all"은 타입 조건 없음 */
export type ProductTypeFilter = ProductType | "all";

export type ProductFilter = {
  keyword: string;
  type: ProductTypeFilter;
};

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  single: "단품",
  pass: "패스",
};

export const PRODUCT_TYPE_FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "pass", label: PRODUCT_TYPE_LABEL.pass },
  { value: "single", label: PRODUCT_TYPE_LABEL.single },
] as const satisfies readonly { value: ProductTypeFilter; label: string }[];

export function isProductTypeFilter(value: unknown): value is ProductTypeFilter {
  return value === "all" || value === "single" || value === "pass";
}
