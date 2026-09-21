"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "검색",
  label = "검색",
}: SearchInputProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-md border border-gray-100 p-2 focus-within:border-primary sm:w-[250px]">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <Image src="/icons/search.svg" alt="" width={20} height={20} />
        <input
          type="search"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          aria-label={label}
          className="min-w-0 flex-1 bg-transparent text-body font-semibold text-gray-800 outline-none placeholder:text-gray-300 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="검색어 지우기"
        className={`shrink-0 ${value ? "visible" : "invisible"}`}
      >
        <Image src="/icons/x.svg" alt="" width={16} height={16} />
      </button>
    </div>
  );
}
