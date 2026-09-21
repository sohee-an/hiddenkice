export type ProductType = "single" | "pass";

export type Product = {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  salePrice: number | null;
  imageUrl: string;
};

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
