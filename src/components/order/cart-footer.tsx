import { ArrowRight } from "lucide-react";
import type { TimeSlot } from "@/src/lib/menu-data";
import { formatCurrency } from "@/src/lib/utils";

interface CartFooterProps {
  slot: TimeSlot;
  total: number;
  disabled?: boolean;
  onCheckout: () => void;
}

export function CartFooter({ slot, total, disabled, onCheckout }: CartFooterProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Waktu Ambil</span>
        <span className="font-medium text-gray-900">{slot.pickupDisplay}</span>
      </div>

      <div className="flex justify-between items-center pt-1">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-xl font-bold text-brand-600">
          {formatCurrency(total)}
        </span>
      </div>

      <button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
      >
        Lanjut Pembayaran
        {!disabled && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
