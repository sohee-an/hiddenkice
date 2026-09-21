"use client";

import { Fragment } from "react";

type Option<T extends string> = { value: T; label: string };

type SegmentedTabsProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex items-center gap-[11px] text-body whitespace-nowrap"
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <Fragment key={option.value}>
            {index > 0 && (
              <span aria-hidden className="text-gray-300">
                |
              </span>
            )}
            <button
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(option.value)}
              className={
                selected ? "text-gray-800" : "text-gray-300 hover:text-gray-500"
              }
            >
              {option.label}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
