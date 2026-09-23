"use client";

import { useEffect } from "react";

/*
 * 루트 레이아웃 자체가 실패했을 때만 쓰인다. layout.tsx를 대체하므로 html/body를 직접 그린다.
 * 이 상황에서는 폰트·토큰이 적용되지 않을 수 있어 인라인 스타일로 최소한의 화면만 보여준다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          color: "#1c1e21",
          background: "#ffffff",
        }}
      >
        <p style={{ fontSize: "18px", fontWeight: 600 }}>
          문제가 발생했습니다.
        </p>
        <p style={{ fontSize: "14px", color: "#979ca5" }}>
          잠시 후 다시 시도해 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            color: "#636873",
            background: "transparent",
            border: "1px solid #ced0d4",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
