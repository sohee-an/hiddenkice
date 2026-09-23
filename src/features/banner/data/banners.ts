export type Banner = {
  id: string;
  imageUrl: string;
  alt: string;
};

const HERO_ALT =
  "히든카이스 - 모두가 푸는 건 이유가 있습니다. 상위권이 선택한 문제집, 결과로 증명된 실전 대비서";

export const BANNERS: Banner[] = Array.from({ length: 5 }, (_, index) => ({
  id: `hero-${index + 1}`,
  imageUrl: "/images/banner-1.png",
  alt: HERO_ALT,
}));
