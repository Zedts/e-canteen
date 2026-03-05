"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

interface CartCheckoutBarProps {
  totalItems: number;
  cartTotal: number;
  onCheckout: () => void;
}

// Sticky mobile bar at the bottom of the order page.
// Shown when the cart is non-empty, allowing the user to
// confirm their selection without opening a full bottom sheet.
export function CartCheckoutBar({
  totalItems,
  cartTotal,
  onCheckout,
}: CartCheckoutBarProps) {
  if (totalItems === 0) return null;

  return (
    <div className="lg:hidden fixed bottom-20 left-0 right-0 z-[55] px-4">
      <button
        onClick={onCheckout}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-float transition-all hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold">{totalItems} item</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold">{formatCurrency(cartTotal)}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
