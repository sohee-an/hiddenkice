"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";
import { BANNERS, type Banner } from "../data/banners";

const AUTO_PLAY_MS = 5000;

const PLAY_PAUSE_SLOT = "banner-play-pause";

type PromoBannerSliderProps = {
  banners?: Banner[];
};

export function PromoBannerSlider({ banners = BANNERS }: PromoBannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [stopped, setStopped] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const total = banners.length;

  const autoPlayable = total > 1 && !prefersReducedMotion;
  const paused = stopped || interacting;

  const goTo = useCallback(
    (index: number) => setCurrent((index + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused || !autoPlayable) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % total),
      AUTO_PLAY_MS,
    );
    return () => clearInterval(timer);
  }, [paused, autoPlayable, total]);

  if (total === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="프로모션 배너"
      className="group relative overflow-hidden border-b border-[#e5e5e5] bg-[#fafafa]"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={(e) => {
        if (e.target.closest(`[data-slot="${PLAY_PAUSE_SLOT}"]`)) return;
        setInteracting(true);
      }}
      onBlur={() => setInteracting(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${total}`}
            aria-hidden={index !== current}
            className="relative aspect-[1440/490] w-full shrink-0 bg-[#f2f5f8]"
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
          <div className="absolute right-4 bottom-4 flex items-center gap-2 md:right-10 md:bottom-[30px]">
            {autoPlayable && (
              <PlayPauseButton
                stopped={stopped}
                onClick={() => setStopped((prev) => !prev)}
              />
            )}
            <p className="w-[60px] rounded-full bg-black/30 px-2.5 py-1 text-center text-body-sm text-white">
              <span className="text-body-sm-semibold">{current + 1}</span>
              <span>/{total}</span>
            </p>
          </div>
        </>
      )}
    </section>
  );
}

function PlayPauseButton({
  stopped,
  onClick,
}: {
  stopped: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-slot={PLAY_PAUSE_SLOT}
      onClick={onClick}
      aria-label={stopped ? "배너 자동 전환 재생" : "배너 자동 전환 일시정지"}
      className="flex size-[30px] items-center justify-center rounded-full bg-black/30 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        {stopped ? (
          <path d="M3.5 2L11.5 7L3.5 12V2Z" fill="currentColor" />
        ) : (
          <>
            <rect x="3" y="2" width="3" height="10" fill="currentColor" />
            <rect x="8" y="2" width="3" height="10" fill="currentColor" />
          </>
        )}
      </svg>
    </button>
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
      className={`absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 ${
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
