import { Suspense } from "react";
import { PromoBannerSlider } from "@/features/banner/components/PromoBannerSlider";
import { ProductSection } from "@/features/product/components/ProductSection";
import { ProductGridSkeleton } from "@/features/product/components/ProductGrid";

export default function StorePage() {
  return (
    <>
      <PromoBannerSlider />
      {/* ProductSection은 useSearchParams를 쓰므로 Suspense 경계 안에 둔다 */}
      <Suspense fallback={<ProductSectionFallback />}>
        <ProductSection />
      </Suspense>
    </>
  );
}

function ProductSectionFallback() {
  return (
    <section className="mx-auto w-full max-w-content px-4 pt-[50px] pb-[50px] xl:px-0">
      <div className="h-[42px]" />
      <div className="mt-9">
        <ProductGridSkeleton />
      </div>
    </section>
  );
}
