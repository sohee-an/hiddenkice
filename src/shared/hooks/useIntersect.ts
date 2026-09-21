"use client";

import { useEffect, useRef } from "react";

export function useIntersect<T extends Element>(
  onIntersect: () => void,
  { enabled = true, rootMargin = "200px" } = {},
) {
  const ref = useRef<T>(null);
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callbackRef.current();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
}
