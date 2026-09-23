import type { Product } from "@/entities/product";
import { Skeleton } from "@/shared/ui/Skeleton";
import { PRODUCT_PAGE_SIZE } from "../api/productService";
import { ProductCard } from "./ProductCard";

const GRID_CLASS =
  "grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-[repeat(4,250px)] xl:justify-between";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className={GRID_CLASS}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({
  count = PRODUCT_PAGE_SIZE,
}: {
  count?: number;
}) {
  return (
    <ul className={GRID_CLASS} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="flex flex-col gap-1">
          <Skeleton className="aspect-[250/320] w-full" />
          <Skeleton className="mt-1 h-5 w-10" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-24" />
        </li>
      ))}
    </ul>
  );
}
