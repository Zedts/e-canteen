"use client";

import Image from "next/image";
import { Plus, Minus, Star } from "lucide-react";
import type { Product } from "@/src/types/product";
import { formatCurrency } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";

interface OrderMenuCardProps {
  item: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function OrderMenuCard({ item, quantity, onAdd, onRemove }: OrderMenuCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 border border-gray-100 shadow-soft flex gap-4 transition-all",
        !item.available && "opacity-60",
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
          unoptimized
        />
        {!item.available && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-[10px]">
              Habis
            </Badge>
          </div>
        )}
      </div>

      {/* Info and controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 text-sm leading-snug">
              {item.name}
            </h3>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-brand-600 shrink-0">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {item.rating}
            </div>
          </div>
          <p className="text-brand-600 font-bold text-sm mt-1">
            {formatCurrency(item.price)}
          </p>
        </div>

        <div className="flex items-center justify-end mt-2">
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="text-sm font-bold text-gray-900 w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={onAdd}
                disabled={!item.available}
                className="w-7 h-7 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center transition disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              disabled={!item.available}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
              Tambah
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
