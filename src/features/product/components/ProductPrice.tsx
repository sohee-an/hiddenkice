import { formatWon, getDiscountRate } from "../lib/price";

type ProductPriceProps = {
  price: number;
  salePrice: number | null;
};

export function ProductPrice({ price, salePrice }: ProductPriceProps) {
  const discountRate = getDiscountRate(price, salePrice);

  if (salePrice === null || discountRate === 0) {
    return (
      <p className="text-body font-semibold">
        {formatWon(salePrice ?? price)}
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <del className="text-body-sm font-medium text-gray-200">
        <span className="sr-only">정가 </span>
        {formatWon(price)}
      </del>
      <p className="flex items-center gap-1.5 text-body font-semibold whitespace-nowrap">
        <span className="text-secondary">
          <span className="sr-only">할인율 </span>
          {discountRate}%
        </span>
        <span>
          <span className="sr-only">판매가 </span>
          {formatWon(salePrice)}
        </span>
      </p>
    </div>
  );
}
