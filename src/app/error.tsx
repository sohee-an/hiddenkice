"use client";

import { useEffect } from "react";

export default function Error({
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
    <div
      role="alert"
      className="mx-auto flex w-full max-w-content flex-col items-center gap-4 px-4 py-32 text-center"
    >
      <p className="text-body-lg text-gray-800">
        페이지를 불러오지 못했습니다.
      </p>
      <p className="text-body-sm text-gray-300">
        잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-md border border-gray-100 px-4 py-2 text-body-sm text-gray-500 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        다시 시도
      </button>
      {error.digest && (
        <p className="text-body-sm text-gray-200">오류 코드: {error.digest}</p>
      )}
    </div>
  );
}
