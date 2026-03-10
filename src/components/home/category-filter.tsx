"use client";

import { cn } from "@/src/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Kategori</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium border shadow-sm whitespace-nowrap transition-all",
              active === category
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
