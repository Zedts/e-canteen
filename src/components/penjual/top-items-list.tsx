import Image from "next/image";
import { cn } from "@/src/lib/utils";
import type { TopMenuItem } from "@/src/lib/mock-dashboard";

interface TopItemsListProps {
  items: TopMenuItem[];
}

export function TopItemsList({ items }: TopItemsListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
      <h3 className="font-serif font-bold text-lg text-gray-900 mb-6">
        Item Terlaris
      </h3>

      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">{item.soldCount} porsi</p>
            </div>

            <span
              className={cn(
                "font-bold text-sm shrink-0",
                index === 0 ? "text-brand-500" : "text-gray-400",
              )}
            >
              #{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
