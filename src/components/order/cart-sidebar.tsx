"use client";

import { ShoppingBag } from "lucide-react";
import type { CartEntry } from "@/src/types/order";
import type { TimeSlot } from "@/src/lib/menu-data";
import { CartItemRow } from "./cart-item-row";
import { CartFooter } from "./cart-footer";

interface CartSidebarProps {
  entries: CartEntry[];
  slot: TimeSlot;
  total: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartSidebar({
  entries,
  slot,
  total,
  onAdd,
  onRemove,
  onCheckout,
}: CartSidebarProps) {
  const isEmpty = entries.length === 0;

  return (
    <aside className="hidden lg:block w-96 shrink-0">
      <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl p-6 shadow-float">
        <h2 className="font-serif text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-gray-400" />
          Pesanan Anda
        </h2>

        <div className="min-h-[150px] max-h-[40vh] overflow-y-auto space-y-4 mb-6 pr-1">
          {isEmpty ? (
            <EmptyCart />
          ) : (
            entries.map(({ item, quantity }) => (
              <CartItemRow
                key={item.id}
                entry={{ item, quantity }}
                onAdd={() => onAdd(item.id)}
                onRemove={() => onRemove(item.id)}
              />
            ))
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <CartFooter
            slot={slot}
            total={total}
            disabled={isEmpty}
            onCheckout={onCheckout}
          />
        </div>
      </div>
    </aside>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
      <p className="text-sm">Keranjang masih kosong.</p>
    </div>
  );
}
