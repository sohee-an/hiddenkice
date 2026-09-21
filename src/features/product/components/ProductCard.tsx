import Image from "next/image";
import { PRODUCT_TYPE_LABEL, type Product } from "../model/types";
import { ProductPrice } from "./ProductPrice";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col gap-1">
      <div className="relative aspect-[250/320] w-full overflow-hidden rounded-md border border-gray-50 bg-white">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 250px, (min-width: 768px) 33vw, 50vw"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-body font-semibold text-gray-300">
          {PRODUCT_TYPE_LABEL[product.type]}
        </p>
        <div className="flex flex-col gap-2">
          <h3 className="text-body font-semibold">{product.title}</h3>
          <ProductPrice price={product.price} salePrice={product.salePrice} />
        </div>
      </div>
    </article>
  );
}
