"use client";

import type { HistoryFilter } from "@/src/types/history";

interface FilterTabsProps {
  active: HistoryFilter;
  counts: { all: number; active: number; completed: number };
  onChange: (filter: HistoryFilter) => void;
}

const TABS: { key: HistoryFilter; label: string }[] = [
  { key: "all",       label: "Semua"   },
  { key: "active",    label: "Aktif"   },
  { key: "completed", label: "Selesai" },
];

export function FilterTabs({ active, counts, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={[
            "flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all",
            active === key
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-800",
          ].join(" ")}
        >
          {label}
          {counts[key] > 0 && (
            <span
              className={[
                "ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full",
                active === key
                  ? "bg-gray-100 text-gray-600"
                  : "bg-gray-200 text-gray-500",
              ].join(" ")}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
