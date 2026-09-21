export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function getDiscountRate(price: number, salePrice: number | null): number {
  if (salePrice === null || price <= 0 || salePrice >= price) return 0;
  return Math.round(((price - salePrice) * 100) / price);
}
