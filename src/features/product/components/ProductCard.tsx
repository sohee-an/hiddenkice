import Image from "next/image";
import { PRODUCT_TYPE_LABEL, type Product } from "../model/types";
import { ProductPrice } from "./ProductPrice";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex cursor-pointer flex-col gap-1">
      <div className="relative aspect-[250/320] w-full overflow-hidden rounded-md border border-gray-50 bg-white transition-[border-color,box-shadow,translate] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 250px, (min-width: 768px) 33vw, 50vw"
          className="object-contain transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-body text-gray-300">
          {PRODUCT_TYPE_LABEL[product.type]}
        </p>
        <div className="flex flex-col gap-2">
          <h3 className="text-body transition-colors group-hover:text-primary">
            {product.title}
          </h3>
          <ProductPrice price={product.price} salePrice={product.salePrice} />
        </div>
      </div>
    </article>
  );
}
