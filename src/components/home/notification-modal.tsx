"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, BellOff, X, Package, Clock } from "lucide-react";
import Link from "next/link";
import { formatOrderId } from "@/src/lib/utils";
import { TIME_SLOTS } from "@/src/lib/menu-data";
import type { ReadyOrder } from "@/src/lib/actions";

interface NotificationModalProps {
  orders:  ReadyOrder[];
  onClose: () => void;
}

function resolveSlotLabel(timeSlotId: string): string {
  return TIME_SLOTS.find((s) => s.id === timeSlotId)?.label ?? timeSlotId;
}

function ReadyOrderCard({ order }: { order: ReadyOrder }) {
  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Package className="w-4 h-4 text-green-600 shrink-0" />
        <span className="font-mono text-xs font-bold text-green-800">
          {formatOrderId(order.id)}
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{order.items.join(", ")}</p>
      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
        <Clock className="w-3 h-3 shrink-0" />
        Ambil pada {resolveSlotLabel(order.timeSlot)}
      </p>
    </div>
  );
}

function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
        <BellOff className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-600">Belum ada notifikasi</p>
      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
        Kami akan memberitahu kamu saat<br />pesanan siap diambil.
      </p>
    </div>
  );
}

export function NotificationModal({ orders, onClose }: NotificationModalProps) {
  const hasOrders = orders.length > 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-500 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Notifikasi pesanan"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-float p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={[
            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
            hasOrders ? "bg-green-50" : "bg-gray-100",
          ].join(" ")}>
            <Bell className={["w-5 h-5", hasOrders ? "text-green-600" : "text-gray-400"].join(" ")} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-base">
              {hasOrders ? "Pesananmu Siap!" : "Notifikasi"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {hasOrders
                ? orders.length === 1
                  ? "1 pesanan menunggu diambil"
                  : `${orders.length} pesanan menunggu diambil`
                : "Tidak ada notifikasi baru"}
            </p>
          </div>
        </div>

        {/* Body */}
        {hasOrders ? (
          <>
            <div className="space-y-3 mb-5">
              {orders.map((order) => (
                <ReadyOrderCard key={order.id} order={order} />
              ))}
            </div>
            <Link
              href="/history"
              onClick={onClose}
              className="block w-full text-center py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors"
            >
              Lihat Pesanan Saya
            </Link>
          </>
        ) : (
          <EmptyNotifications />
        )}
      </div>
    </div>,
    document.body,
  );
}