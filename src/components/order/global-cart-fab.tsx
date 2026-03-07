"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { useCartContext } from "@/src/context/cart-context";
import { CartItemRow } from "@/src/components/order/cart-item-row";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { formatCurrency } from "@/src/lib/utils";

// Mounted globally in layout.tsx — stays alive across navigations.
// Hidden on /order since that page has its own cart UI.
export function GlobalCartFab() {
  const [open, setOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { cartEntries, cartTotal, totalItems, add, remove, removeAll } = useCartContext();

  const isOnOrderPage = pathname === "/order";
  const shouldRender = totalItems > 0 && !isOnOrderPage;

  if (!shouldRender) return null;

  function handleFabClick() {
    // Desktop: navigate directly to order page; Mobile: open bottom sheet
    if (window.innerWidth >= 1024) {
      router.push("/order");
    } else {
      setOpen(true);
    }
  }

  function handleCheckout() {
    setOpen(false);
    router.push("/order");
  }

  return (
    <>
      {/* FAB Button — visible on all screen sizes, always pinned bottom-right */}
      <button
        onClick={handleFabClick}
        className="fixed bottom-24 right-5 lg:bottom-6 w-14 h-14 bg-brand-500 text-white rounded-full shadow-float flex items-center justify-center z-60 hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/30 transition-all"
        aria-label="Lihat keranjang"
      >
        <ShoppingBag className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 border-2 border-white text-white rounded-full text-[10px] font-bold flex items-center justify-center">
          {totalItems}
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-70 bg-gray-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={[
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-float z-80 flex flex-col max-h-[80vh] lg:hidden transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            Keranjang Anda
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartEntries.map(({ item, quantity }) => (
            <CartItemRow
              key={item.id}
              entry={{ item, quantity }}
              onAdd={() => add(item.id)}
              onRemove={() => remove(item.id)}
              onRemoveAll={() => setPendingRemove({ id: item.id, name: item.name })}
            />
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-5">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-brand-600">
              {formatCurrency(cartTotal)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full py-4 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Lanjut ke Pemesanan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={pendingRemove !== null}
        title="Hapus dari keranjang?"
        description={pendingRemove ? `"${pendingRemove.name}" akan dihapus dari keranjangmu.` : undefined}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="destructive"
        onConfirm={() => {
          if (pendingRemove) removeAll(pendingRemove.id);
          setPendingRemove(null);
        }}
        onCancel={() => setPendingRemove(null)}
      />
    </>
  );
}
