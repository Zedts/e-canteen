"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, ShoppingBag, AlertCircle } from "lucide-react";
import { Navbar } from "@/src/components/home/navbar";
import { BottomNav } from "@/src/components/home/bottom-nav";
import { FilterTabs } from "@/src/components/history/filter-tabs";
import { OrderCard } from "@/src/components/history/order-card";
import type { OrderWithItems, HistoryFilter } from "@/src/types/history";
import { isActiveOrder, matchesFilter } from "@/src/types/history";

interface HistoryProps {
  user: {
    name?: string | null;
    email?: string | null;
    balance: number;
    role: "USER" | "PENJUAL" | "ADMIN";
  };
  orders: OrderWithItems[];
  dbUnavailable?: boolean;
}

export default function History({ user, orders, dbUnavailable }: HistoryProps) {
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const counts = {
    all:       orders.length,
    active:    orders.filter((o) => isActiveOrder(o.status)).length,
    completed: orders.filter((o) => !isActiveOrder(o.status)).length,
  };

  const visibleOrders = orders.filter((o) => matchesFilter(o.status, filter));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar user={user} activePage="history" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-12 animate-fade-in">

        {/* DB unavailable banner */}
        {dbUnavailable && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-amber-800">
              Tidak dapat memuat riwayat saat ini. Pastikan database sudah berjalan dan migration telah diterapkan.
            </p>
          </div>
        )}

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              Riwayat Pesanan
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Lacak pesanan aktif dan yang telah selesai.
            </p>
          </div>

          <FilterTabs active={filter} counts={counts} onChange={setFilter} />
        </div>

        {/* Order list */}
        {visibleOrders.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-4">
            {visibleOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

      </main>

      <BottomNav active="history" />
    </div>
  );
}

function EmptyState({ filter }: { filter: HistoryFilter }) {
  const messages: Record<HistoryFilter, { title: string; subtitle: string }> = {
    all: {
      title: "Belum ada pesanan",
      subtitle: "Mulai pesan makananmu sekarang!",
    },
    active: {
      title: "Tidak ada pesanan aktif",
      subtitle: "Semua pesananmu sudah selesai.",
    },
    completed: {
      title: "Belum ada pesanan selesai",
      subtitle: "Pesanan yang selesai akan muncul di sini.",
    },
  };

  const { title, subtitle } = messages[filter];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-6">{subtitle}</p>
      {filter === "all" && (
        <Link
          href="/order"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-sm font-semibold transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Pesan Sekarang
        </Link>
      )}
    </div>
  );
}
