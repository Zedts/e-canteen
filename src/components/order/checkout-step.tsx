"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, CheckCircle, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { placeOrder } from "@/src/lib/actions";
import type { CartEntry } from "@/src/types/order";
import type { TimeSlot } from "@/src/lib/menu-data";
import { formatCurrency } from "@/src/lib/utils";
import { useCartContext } from "@/src/context/cart-context";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";

interface CheckoutStepProps {
  user: {
    id: string;
    name?: string | null;
    balance: number;
  };
  slot: TimeSlot;
  onBack: () => void;
}

export function CheckoutStep({ user, slot, onBack }: CheckoutStepProps) {
  const router = useRouter();
  const { cartEntries, cartTotal, add, remove, removeAll, clear } = useCartContext();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingRemove, setPendingRemove] = useState<{ id: string; name: string } | null>(null);

  // If all items are removed while on this step, go back automatically
  useEffect(() => {
    if (cartEntries.length === 0 && status === "idle") onBack();
  }, [cartEntries.length, status, onBack]);

  const remaining = user.balance - cartTotal;
  const canAfford = remaining >= 0;
  const canSubmit = cartEntries.length > 0 && canAfford && status !== "loading";

  async function handlePayment() {
    if (!canSubmit) return;

    setStatus("loading");
    setErrorMessage("");

    const items = cartEntries.map(({ item, quantity }) => ({
      productId: item.id,
      quantity,
    }));

    const result = await placeOrder(user.id, slot.id, items);

    if (!result.ok) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }

    clear();
    setStatus("success");
    setTimeout(() => router.push("/history"), 1800);
  }

  if (status === "success") {
    return <SuccessScreen />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-10 animate-fade-in">

          <Header onBack={onBack} />

          <div className="mt-6 flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-6 lg:items-start">
            {/* Left — order summary */}
            <OrderSummary
              entries={cartEntries}
              slot={slot}
              total={cartTotal}
              onAdd={add}
              onRemove={remove}
              onRemoveAll={(id, name) => setPendingRemove({ id, name })}
            />

            {/* Right — payment + action */}
            <div className="flex flex-col gap-5 w-full">
              <PaymentMethod
                balance={user.balance}
                remaining={remaining}
                canAfford={canAfford}
              />

              {status === "error" && (
                <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={handlePayment}
                disabled={!canSubmit}
                className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-float transition-all hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Bayar & Konfirmasi"
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      <ConfirmDialog
        open={pendingRemove !== null}
        title="Hapus dari pesanan?"
        description={pendingRemove ? `"${pendingRemove.name}" akan dihapus dari pesananmu.` : undefined}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shrink-0"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
        Konfirmasi Pesanan
      </h1>
    </div>
  );
}

interface OrderSummaryProps {
  entries: CartEntry[];
  slot: TimeSlot;
  total: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onRemoveAll: (id: string, name: string) => void;
}

function OrderSummary({ entries, slot, total, onAdd, onRemove, onRemoveAll }: OrderSummaryProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-soft">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <h2 className="font-bold text-lg text-gray-900">Ringkasan Pesanan</h2>
        <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">
          {slot.label}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        {entries.map((entry) => (
          <CheckoutItemRow
            key={entry.item.id}
            entry={entry}
            onAdd={() => onAdd(entry.item.id)}
            onRemove={() => onRemove(entry.item.id)}
            onRemoveAll={() => onRemoveAll(entry.item.id, entry.item.name)}
          />
        ))}
      </div>

      <div className="border-t border-gray-100 pt-6 flex justify-between items-end">
        <span className="text-gray-500 font-medium">Total Pembayaran</span>
        <span className="text-2xl font-bold text-brand-600">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

interface CheckoutItemRowProps {
  entry: CartEntry;
  onAdd: () => void;
  onRemove: () => void;
  onRemoveAll: () => void;
}

function CheckoutItemRow({ entry, onAdd, onRemove, onRemoveAll }: CheckoutItemRowProps) {
  const { item, quantity } = entry;

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
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
        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-xs text-gray-400">{formatCurrency(item.price)} / porsi</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Stepper */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-gray-900 tabular-nums">
            {quantity}
          </span>
          <button
            onClick={onAdd}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <span className="text-sm font-bold text-gray-900 w-20 text-right tabular-nums hidden sm:block">
          {formatCurrency(item.price * quantity)}
        </span>

        {/* Remove item */}
        <button
          onClick={onRemoveAll}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface PaymentMethodProps {
  balance: number;
  remaining: number;
  canAfford: boolean;
}

function PaymentMethod({ balance, remaining, canAfford }: PaymentMethodProps) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
        Metode Pembayaran
      </p>
      <div className="bg-white border-2 border-brand-500 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white shrink-0">
          <CreditCard className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900">Saldo Virtual</p>
          <p className="text-sm text-gray-500">
            Tersedia: {formatCurrency(balance)}
          </p>
        </div>
        <div className="w-5 h-5 rounded-full border-4 border-brand-500" />
      </div>

      <div className="flex justify-between items-center px-1 pt-4 text-sm">
        <span className="text-gray-500">Sisa saldo setelah pembayaran</span>
        <span className={canAfford ? "font-bold text-gray-900" : "font-bold text-red-500"}>
          {formatCurrency(remaining)}
        </span>
      </div>

      {!canAfford && (
        <p className="text-xs text-red-500 font-medium mt-2 pl-1">
          Saldo tidak mencukupi untuk melanjutkan pembayaran.
        </p>
      )}
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Pesanan Dikonfirmasi!
        </h2>
        <p className="text-gray-500 text-sm">
          Dapur sedang menyiapkan pesanan Anda. Mengarahkan ke riwayat pesanan…
        </p>
      </div>
    </div>
  );
}
