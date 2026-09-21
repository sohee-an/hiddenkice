import { Suspense } from "react";
import { PromoBannerSlider } from "@/features/banner/components/PromoBannerSlider";
import {
  ProductSection,
  ProductSectionSkeleton,
} from "@/features/product/components/ProductSection";

export default function StorePage() {
  return (
    <>
      <h1 className="sr-only">히든카이스 교재 스토어</h1>
      <PromoBannerSlider />
      {/* ProductSection은 useSearchParams를 쓰므로 Suspense 경계 안에 둔다 */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <ProductSection />
      </Suspense>
    </>
  );
}
