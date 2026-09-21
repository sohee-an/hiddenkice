"use client";

import { useCallback, useEffect, useRef } from "react";

/** 마지막 호출 후 delay(ms)가 지나면 callback을 한 번 실행하는 함수를 반환한다 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 300,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbackRef = useRef(callback);

  // 항상 최신 callback을 호출하도록 유지
  useEffect(() => {
    callbackRef.current = callback;
  });

  // 언마운트 시 대기 중인 호출 취소
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useCallback(
    (...args: Args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );
}
