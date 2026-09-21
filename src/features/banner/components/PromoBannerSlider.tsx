"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { BANNERS, type Banner } from "../data/banners";

const AUTO_PLAY_MS = 5000;

type PromoBannerSliderProps = {
  banners?: Banner[];
};

export function PromoBannerSlider({ banners = BANNERS }: PromoBannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = banners.length;

  const goTo = useCallback(
    (index: number) => setCurrent((index + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % total),
      AUTO_PLAY_MS,
    );
    return () => clearInterval(timer);
  }, [paused, total]);

  if (total === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="프로모션 배너"
      className="group relative overflow-hidden border-b border-[#e5e5e5] bg-[#f2f5f8]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${total}`}
            aria-hidden={index !== current}
            className="relative aspect-[1440/490] w-full shrink-0"
          >
            <Image
              src={banner.imageUrl}
              alt={banner.alt}
              fill
              sizes="100vw"
              className="object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <ArrowButton direction="prev" onClick={() => goTo(current - 1)} />
          <ArrowButton direction="next" onClick={() => goTo(current + 1)} />
          <p className="absolute right-4 bottom-4 w-[60px] rounded-full bg-black/30 px-2.5 py-1 text-center text-body-sm text-white md:right-10 md:bottom-[30px]">
            <span className="text-body-sm-semibold">{current + 1}</span>
            <span>/{total}</span>
          </p>
        </>
      )}
    </section>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "이전 배너" : "다음 배너"}
      className={`absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 ${
        isPrev ? "left-4" : "right-4"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d={isPrev ? "M12.5 15L7.5 10L12.5 5" : "M7.5 5L12.5 10L7.5 15"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
