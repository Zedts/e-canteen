"use client";

import { Clock, CheckCircle, XCircle, Package } from "lucide-react";
import type { OrderWithItems, OrderStatus } from "@/src/types/history";
import { isActiveOrder } from "@/src/types/history";
import { formatCurrency, formatRelativeTime, formatOrderId } from "@/src/lib/utils";
import { TIME_SLOTS } from "@/src/lib/menu-data";

interface OrderCardProps {
  order: OrderWithItems;
}

interface StatusConfig {
  label: string;
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    label: "Menunggu",
    className: "bg-yellow-50 text-yellow-700",
    Icon: Clock,
  },
  PREPARING: {
    label: "Diproses",
    className: "bg-brand-50 text-brand-700",
    Icon: Clock,
  },
  READY: {
    label: "Siap Diambil",
    className: "bg-green-50 text-green-700",
    Icon: Package,
  },
  COMPLETED: {
    label: "Selesai",
    className: "bg-green-50 text-green-700",
    Icon: CheckCircle,
  },
  CANCELLED: {
    label: "Dibatalkan",
    className: "bg-red-50 text-red-600",
    Icon: XCircle,
  },
};

const PREPARING_MESSAGES: Record<OrderStatus, string> = {
  PENDING: "Pesanan Anda sedang menunggu konfirmasi dapur",
  PREPARING: "Dapur sedang menyiapkan pesanan Anda",
  READY: "Pesanan siap! Segera ambil di kantin",
  COMPLETED: "",
  CANCELLED: "",
};

const PROGRESS_WIDTHS: Record<OrderStatus, string> = {
  PENDING: "w-1/4",
  PREPARING: "w-1/2",
  READY: "w-full",
  COMPLETED: "w-full",
  CANCELLED: "w-0",
};

function buildItemsSummary(items: Array<{ quantity: number; name: string }>): string {
  return items
    .map(({ quantity, name }) => `${quantity}x ${name}`)
    .join(", ");
}

function resolvePickupLabel(timeSlotId: string): string {
  return (
    TIME_SLOTS.find((s) => s.id === timeSlotId)?.pickupDisplay ?? timeSlotId
  );
}

export function OrderCard({ order }: OrderCardProps) {
  const config = STATUS_CONFIG[order.status];
  const active = isActiveOrder(order.status);
  const progressMsg = PREPARING_MESSAGES[order.status];

  return (
    <div
      className={[
        "bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm transition-opacity",
        !active ? "opacity-75 hover:opacity-100" : "",
      ].join(" ")}
    >
      {/* Header row */}
      <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            {formatRelativeTime(order.createdAt)}
          </p>
          <p className="font-mono text-sm font-semibold text-gray-900">
            {formatOrderId(order.id)}
          </p>
        </div>

        <span
          className={[
            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full",
            config.className,
          ].join(" ")}
        >
          <config.Icon className="w-3.5 h-3.5" />
          {config.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm leading-relaxed truncate">
            {buildItemsSummary(order.items)}
          </p>
          <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Ambil pada{" "}
            <strong className="text-gray-700 font-semibold">
              {resolvePickupLabel(order.timeSlot)}
            </strong>
          </p>
        </div>
        <p className="font-bold text-lg text-brand-600 whitespace-nowrap">
          {formatCurrency(order.total)}
        </p>
      </div>

      {/* Progress bar — only for active orders */}
      {active && progressMsg && (
        <div className="mt-5 pt-5 border-t border-gray-50">
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2.5 overflow-hidden">
            <div
              className={[
                "h-1.5 rounded-full transition-all duration-500",
                PROGRESS_WIDTHS[order.status],
                order.status === "READY" ? "bg-green-500" : "bg-brand-500",
              ].join(" ")}
            >
              {order.status !== "READY" && (
                <div className="w-full h-full bg-white/30 animate-pulse rounded-full" />
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-500 text-center font-medium">
            {progressMsg}
          </p>
        </div>
      )}
    </div>
  );
}
