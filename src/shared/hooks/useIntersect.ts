"use client";

import { useCallback, useEffect, useRef } from "react";

export function useIntersect<T extends Element>(
  onIntersect: () => void,
  { enabled = true, rootMargin = "200px" } = {},
) {
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  });

  return useCallback(
    (element: T | null) => {
      if (!element || !enabled) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) callbackRef.current();
        },
        { rootMargin },
      );
      observer.observe(element);
      return () => observer.disconnect();
    },
    [enabled, rootMargin],
  );
}
