import { Banknote, ShoppingBag, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StatData, TopMenuItem } from "@/src/types/penjual";
import { StatCard } from "./stat-card";
import { OrdersChart } from "./orders-chart";
import { TopItemsList } from "./top-items-list";

const STAT_ICONS: LucideIcon[] = [Banknote, ShoppingBag, Users];

interface DashboardPageProps {
  stats: StatData[];
  chartData: { labels: string[]; values: number[] };
  topItems: TopMenuItem[];
}

export function DashboardPage({ stats, chartData, topItems }: DashboardPageProps) {
  const operationalDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Ringkasan Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Performa operasional kantin hari ini.
          </p>
        </div>
        <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm shrink-0">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
            Tanggal Operasional
          </p>
          <p className="text-sm font-bold text-gray-900 capitalize">
            {operationalDate}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} icon={STAT_ICONS[i]} />
        ))}
      </div>

      {/* Chart + Top items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrdersChart labels={chartData.labels} values={chartData.values} />
        </div>
        <TopItemsList items={topItems} />
      </div>
    </div>
  );
}
