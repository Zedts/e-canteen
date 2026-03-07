import type { DailyReport, ReportOrder } from "@/src/types/penjual";
import { formatCurrency } from "./utils";

// ─── CSV Download ─────────────────────────────────────────────────────────────

function downloadCSV(rows: string[][], filename: string) {
  // BOM prefix ensures Excel opens the file with correct UTF-8 encoding
  const csv = "\uFEFF" + rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

// ─── Export Functions ─────────────────────────────────────────────────────────

export function exportDailyReports(reports: DailyReport[], periodLabel: string) {
  const header = ["Tanggal", "Jumlah Pesanan", "Pendapatan (Rp)"];
  const rows = reports.map((r) => [r.date, String(r.orders), String(r.revenue)]);
  downloadCSV([header, ...rows], `laporan-harian-${periodLabel}.csv`);
}

export function exportOrderLog(orders: ReportOrder[], periodLabel: string) {
  const header = ["ID Pesanan", "Nama Pelanggan", "Item", "Total", "Tanggal", "Sesi Makan"];
  const slotLabel: Record<ReportOrder["slot"], string> = {
    break1: "Istirahat 1",
    break2: "Istirahat 2",
  };
  const rows = orders.map((o) => [
    o.id,
    o.customerName,
    o.items.join("; "),
    formatCurrency(o.total),
    o.date,
    slotLabel[o.slot],
  ]);
  downloadCSV([header, ...rows], `log-pesanan-${periodLabel}.csv`);
}
