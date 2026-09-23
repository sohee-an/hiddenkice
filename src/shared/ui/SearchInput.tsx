"use client";

import Image from "next/image";
import { useRef, type ChangeEvent, type ComponentProps } from "react";

type SearchInputProps = Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "type"
> & {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /* 폭 같은 레이아웃은 호출부가 정한다 */
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "검색",
  label = "검색",
  className = "",
  ...inputProps
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-gray-100 p-2 focus-within:border-primary ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <Image src="/icons/search.svg" alt="" width={20} height={20} />
        <input
          /* 전달받은 props를 먼저 펼쳐 내부 배선(ref, value, onChange)이 덮이지 않게 한다 */
          {...inputProps}
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          aria-label={label}
          className="min-w-0 flex-1 bg-transparent text-body text-gray-800 outline-none placeholder:text-gray-300 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <button
        type="button"
        /* 버튼이 숨겨지면 포커스가 사라지므로 입력창으로 되돌린다 */
        onClick={() => {
          onChange("");
          inputRef.current?.focus();
        }}
        aria-label="검색어 지우기"
        className={`shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${value ? "visible" : "invisible"}`}
      >
        <Image src="/icons/x.svg" alt="" width={16} height={16} />
      </button>
    </div>
  );
}
