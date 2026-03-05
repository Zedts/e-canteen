"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import Image from "next/image";
import type { CartEntry } from "@/src/types/order";
import type { TimeSlot } from "@/src/lib/menu-data";
import { formatCurrency } from "@/src/lib/utils";

interface CheckoutStepProps {
  user: {
    name?: string | null;
    balance: number;
  };
  cartEntries: CartEntry[];
  slot: TimeSlot;
  total: number;
  onBack: () => void;
  onSuccess: () => void;
}

export function CheckoutStep({
  user,
  cartEntries,
  slot,
  total,
  onBack,
  onSuccess,
}: CheckoutStepProps) {
  const [paid, setPaid] = useState(false);

  const remaining = user.balance - total;
  const canAfford = remaining >= 0;

  if (paid) {
    return <SuccessScreen onDone={onSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 animate-fade-in">
        {/* Header */}
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

        {/* Order summary */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-soft">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h2 className="font-bold text-lg text-gray-900">Ringkasan Pesanan</h2>
            <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">
              {slot.label}
            </span>
          </div>

          <div className="space-y-4 mb-8">
            {cartEntries.map(({ item, quantity }) => (
              <div key={item.id} className="flex items-center gap-4">
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
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {quantity}x · {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900 shrink-0">
                  {formatCurrency(item.price * quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-between items-end">
            <span className="text-gray-500 font-medium">Total Pembayaran</span>
            <span className="text-2xl font-bold text-brand-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Payment method */}
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
                Tersedia: {formatCurrency(user.balance)}
              </p>
            </div>
            <div className="w-5 h-5 rounded-full border-4 border-brand-500" />
          </div>

          <div className="flex justify-between items-center px-1 pt-4 text-sm">
            <span className="text-gray-500">Sisa saldo setelah pembayaran</span>
            <span
              className={[
                "font-bold",
                canAfford ? "text-gray-900" : "text-red-500",
              ].join(" ")}
            >
              {formatCurrency(remaining)}
            </span>
          </div>

          {!canAfford && (
            <p className="text-xs text-red-500 font-medium mt-2 pl-1">
              Saldo tidak mencukupi untuk melanjutkan pembayaran.
            </p>
          )}
        </div>

        {/* Confirm button */}
        <button
          onClick={() => setPaid(true)}
          disabled={!canAfford}
          className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-float transition-all hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          Bayar & Konfirmasi
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Pesanan Dikonfirmasi!
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Dapur sedang menyiapkan pesanan Anda. Silakan ambil sesuai jadwal
          istirahat yang dipilih.
        </p>
        <button
          onClick={onDone}
          className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-bold transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
