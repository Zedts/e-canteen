"use client";

import { useState, useMemo } from "react";
import { FileDown, TrendingUp, ShoppingBag, Banknote } from "lucide-react";
import { cn, formatCurrency } from "@/src/lib/utils";
import { MOCK_DAILY_REPORTS, MOCK_REPORT_ORDERS } from "@/src/lib/mock-dashboard";
import { exportDailyReports, exportOrderLog } from "@/src/lib/report-utils";
import { AdminShell } from "@/src/components/admin/admin-shell";
import type { DailyReport, ReportOrder } from "@/src/types/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

type PeriodKey = "today" | "week" | "month";

interface Period {
  key: PeriodKey;
  label: string;
  days: number;
  exportLabel: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIODS: Period[] = [
  { key: "today",  label: "Hari Ini",  days: 1,  exportLabel: "hari-ini"  },
  { key: "week",   label: "7 Hari",    days: 7,  exportLabel: "7-hari"    },
  { key: "month",  label: "30 Hari",   days: 30, exportLabel: "30-hari"   },
];

const SLOT_LABELS: Record<ReportOrder["slot"], string> = {
  break1: "Istirahat 1",
  break2: "Istirahat 2",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateCutoff(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - (days - 1));
  return date.toISOString().split("T")[0];
}

function filterByPeriod<T extends { date: string }>(items: T[], days: number): T[] {
  const cutoff = getDateCutoff(days);
  return items.filter((item) => item.date >= cutoff);
}

function computeSummary(reports: DailyReport[], orders: ReportOrder[]) {
  const totalRevenue = reports.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = reports.reduce((sum, r) => sum + r.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  return { totalRevenue, totalOrders, avgOrderValue, orderCount: orders.length };
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  return `${day} ${months[Number(month) - 1]} ${year}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}

function SummaryCard({ label, value, icon, iconBg }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{label}</p>
        <p className="font-bold text-gray-900 text-xl mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminLaporan() {
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("week");

  const period = PERIODS.find((p) => p.key === activePeriod)!;
  const filteredReports = useMemo(() => filterByPeriod(MOCK_DAILY_REPORTS, period.days), [period.days]);
  const filteredOrders = useMemo(() => filterByPeriod(MOCK_REPORT_ORDERS, period.days), [period.days]);
  const summary = useMemo(() => computeSummary(filteredReports, filteredOrders), [filteredReports, filteredOrders]);

  function handleExportReports() {
    exportDailyReports(filteredReports, period.exportLabel);
  }

  function handleExportOrders() {
    exportOrderLog(filteredOrders, period.exportLabel);
  }

  return (
    <AdminShell activePage="laporan">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Laporan</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Ringkasan pendapatan dan riwayat transaksi.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportReports}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              Ringkasan
            </button>
            <button
              onClick={handleExportOrders}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Period filter tabs */}
        <div className="flex gap-2 mb-6">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              className={cn(
                "px-5 py-2 rounded-xl font-medium text-sm border transition-all",
                activePeriod === p.key
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            label="Total Pendapatan"
            value={formatCurrency(summary.totalRevenue)}
            iconBg="bg-green-50"
            icon={<Banknote className="w-6 h-6 text-green-600" />}
          />
          <SummaryCard
            label="Total Pesanan"
            value={String(summary.totalOrders)}
            iconBg="bg-blue-50"
            icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          />
          <SummaryCard
            label="Rata-rata per Pesanan"
            value={formatCurrency(summary.avgOrderValue)}
            iconBg="bg-brand-50"
            icon={<TrendingUp className="w-6 h-6 text-brand-600" />}
          />
        </div>

        {/* Daily breakdown table */}
        <section className="mb-8">
          <h2 className="font-bold text-gray-800 text-base mb-4">Ringkasan Harian</h2>

          {filteredReports.length === 0 ? (
            <EmptyTable message="Tidak ada data untuk periode ini." />
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Tanggal</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Pesanan</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Pendapatan</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Rata-rata</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((row, idx) => (
                    <tr
                      key={row.date}
                      className={cn(
                        "border-b border-gray-50 last:border-0",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                      )}
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">{formatDate(row.date)}</td>
                      <td className="px-6 py-4 text-gray-700">{row.orders}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(row.revenue)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                        {formatCurrency(Math.round(row.revenue / row.orders))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Orders log table */}
        <section>
          <h2 className="font-bold text-gray-800 text-base mb-4">
            Log Pesanan
            {filteredOrders.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({filteredOrders.length} transaksi)
              </span>
            )}
          </h2>

          {filteredOrders.length === 0 ? (
            <EmptyTable message="Tidak ada pesanan untuk periode ini." />
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">ID</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Pelanggan</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Item</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Total</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Tanggal</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Sesi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr
                      key={order.id}
                      className={cn(
                        "border-b border-gray-50 last:border-0",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                      )}
                    >
                      <td className="px-6 py-4 font-mono text-gray-400 text-xs">{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.className}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-[200px]">
                        <p className="truncate">{order.items.join(", ")}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(order.date)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                          {SLOT_LABELS[order.slot]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function EmptyTable({ message }: { message: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm py-14 flex items-center justify-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
