export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/** 정가 대비 할인율(%)을 반올림해 반환. 할인이 없으면 0 */
export function getDiscountRate(price: number, salePrice: number | null): number {
  if (salePrice === null || price <= 0 || salePrice >= price) return 0;
  return Math.round((1 - salePrice / price) * 100);
}
