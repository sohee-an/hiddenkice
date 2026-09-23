import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="text-body-lg text-gray-800">페이지를 찾을 수 없습니다.</p>
      <p className="text-body-sm text-gray-300">
        주소가 바뀌었거나 삭제된 페이지입니다.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md border border-gray-100 px-4 py-2 text-body-sm text-gray-500 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        스토어로 이동
      </Link>
    </div>
  );
}
