"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { TIME_SLOTS } from "@/src/lib/menu-data";
import { MOCK_QUEUE_ORDERS } from "@/src/lib/mock-dashboard";
import { PenjualShell } from "@/src/components/penjual/penjual-shell";
import type { QueueOrder, QueueOrderStatus } from "@/src/types/penjual";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: QueueOrderStatus }) {
  if (status === "READY") {
    return (
      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shrink-0">
        Siap
      </span>
    );
  }
  return (
    <span className="bg-brand-100 text-brand-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shrink-0">
      Diproses
    </span>
  );
}

interface OrderCardProps {
  order: QueueOrder;
  onMarkReady: (id: string) => void;
  onComplete: (id: string) => void;
}

function OrderCard({ order, onMarkReady, onComplete }: OrderCardProps) {
  const isReady = order.status === "READY";

  return (
    <div
      className={cn(
        "bg-white border rounded-2xl p-5 shadow-sm transition-all flex flex-col",
        isReady
          ? "border-green-300 bg-green-50/30"
          : "border-gray-200 hover:shadow-md",
      )}
    >
      <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
            {order.customerName}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {order.className} •{" "}
            <span className="font-mono text-gray-400">{order.id}</span>
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {order.items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-sm text-gray-700 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-gray-100">
        {isReady ? (
          <button
            onClick={() => onComplete(order.id)}
            className="w-full py-2.5 rounded-xl font-bold text-green-700 bg-white border border-green-200 hover:bg-green-50 transition-colors text-sm"
          >
            Selesaikan Pesanan
          </button>
        ) : (
          <button
            onClick={() => onMarkReady(order.id)}
            className="w-full py-2.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors text-sm"
          >
            Tandai Siap
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full py-16 flex flex-col items-center text-center text-gray-400">
      <ClipboardList className="w-12 h-12 mb-3 opacity-30" />
      <p className="text-sm">Tidak ada pesanan antre untuk waktu ini.</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PenjualQueue() {
  const [orders, setOrders] = useState<QueueOrder[]>(MOCK_QUEUE_ORDERS);
  const [activeSlot, setActiveSlot] = useState<"break1" | "break2">("break1");

  const pendingOrderCount = orders.filter((o) => o.status === "PREPARING").length;
  const filteredOrders = orders.filter((o) => o.slot === activeSlot);
  const countBySlot = (slot: "break1" | "break2") =>
    orders.filter((o) => o.slot === slot).length;

  function markReady(id: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "READY" as const } : o)),
    );
  }

  function completeOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <PenjualShell activePage="queue" pendingOrderCount={pendingOrderCount}>
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Antrean Langsung
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Kelola pesanan masuk untuk hari ini.
          </p>
        </div>

        {/* Slot tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          {TIME_SLOTS.map((slot) => {
            const isActive = activeSlot === slot.id;
            const count = countBySlot(slot.id);

            return (
              <button
                key={slot.id}
                onClick={() => setActiveSlot(slot.id)}
                className={cn(
                  "flex-shrink-0 px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 border transition-all",
                  isActive
                    ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                )}
              >
                {slot.label} ({slot.time.split(" - ")[0]})
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.length === 0 ? (
            <EmptyState />
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onMarkReady={markReady}
                onComplete={completeOrder}
              />
            ))
          )}
        </div>
      </div>
    </PenjualShell>
  );
}
