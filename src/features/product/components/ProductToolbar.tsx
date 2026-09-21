"use client";

import { SearchInput } from "@/shared/ui/SearchInput";
import { SegmentedTabs } from "@/shared/ui/SegmentedTabs";
import {
  PRODUCT_TYPE_FILTER_OPTIONS,
  type ProductTypeFilter,
} from "../model/types";

type ProductToolbarProps = {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  type: ProductTypeFilter;
  onTypeChange: (type: ProductTypeFilter) => void;
};

export function ProductToolbar({
  keyword,
  onKeywordChange,
  type,
  onTypeChange,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-[17px]">
      <SearchInput
        value={keyword}
        onChange={onKeywordChange}
        label="교재 검색"
      />
      <SegmentedTabs
        label="교재 유형"
        options={PRODUCT_TYPE_FILTER_OPTIONS}
        value={type}
        onChange={onTypeChange}
      />
    </div>
  );
}
