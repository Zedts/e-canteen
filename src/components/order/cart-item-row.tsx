import { Plus, Minus, Trash2 } from "lucide-react";
import type { CartEntry } from "@/src/types/order";
import { formatCurrency } from "@/src/lib/utils";

interface CartItemRowProps {
  entry: CartEntry;
  onAdd: () => void;
  onRemove: () => void;
  onRemoveAll?: () => void;
}

export function CartItemRow({ entry, onAdd, onRemove, onRemoveAll }: CartItemRowProps) {
  const { item, quantity } = entry;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-xs text-brand-600 font-bold mt-0.5">
          {formatCurrency(item.price * quantity)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRemove}
          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
        >
          <Minus className="w-3 h-3 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-gray-900 w-4 text-center">
          {quantity}
        </span>
        <button
          onClick={onAdd}
          className="w-6 h-6 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center transition"
        >
          <Plus className="w-3 h-3 text-white" />
        </button>
        {onRemoveAll && (
          <button
            onClick={onRemoveAll}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 flex items-center justify-center transition ml-1"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
