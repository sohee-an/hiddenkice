export type ProductType = "single" | "pass";

export type Product = {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  salePrice: number | null;
  imageUrl: string;
};

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  single: "단품",
  pass: "패스",
};

export function isProductType(value: unknown): value is ProductType {
  return (
    typeof value === "string" && Object.hasOwn(PRODUCT_TYPE_LABEL, value)
  );
}
