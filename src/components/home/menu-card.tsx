import Image from "next/image";
import { Star } from "lucide-react";
import type { MenuItem } from "@/src/lib/menu-data";
import { formatCurrency } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <div
      className={[
        "bg-white rounded-2xl p-3 border border-gray-100 shadow-soft transition-transform",
        item.available
          ? "cursor-pointer hover:-translate-y-1"
          : "opacity-60 cursor-not-allowed",
      ].join(" ")}
    >
      {/* Image */}
      <div className="aspect-square rounded-xl bg-gray-100 mb-3 overflow-hidden relative">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
          unoptimized
        />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-brand-600 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {item.rating}
        </div>

        {!item.available && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-xl">
            <Badge variant="secondary" className="text-xs font-semibold">
              Habis
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
      <p className="text-brand-600 font-bold text-sm mt-1">
        {formatCurrency(item.price)}
      </p>
    </div>
  );
}
