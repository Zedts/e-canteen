import { MENU_ITEMS, type MenuItem } from "./menu-data";
import type { QueueOrder, DailyReport, ReportOrder } from "@/src/types/penjual";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatData {
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
  trend?: { label: string; positive: boolean };
}

export interface TopMenuItem extends MenuItem {
  soldCount: number;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export const DASHBOARD_STATS: StatData[] = [
  {
    label: "Total Pendapatan",
    value: "Rp 3,2 Jt",
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    trend: { label: "+12% dari kemarin", positive: true },
  },
  {
    label: "Total Pesanan",
    value: "317",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    label: "Pelanggan Aktif",
    value: "284",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
];

// ─── Chart ────────────────────────────────────────────────────────────────────

export const ORDER_CHART_DATA = {
  labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  values: [15, 42, 125, 40, 105, 20],
};

// ─── Top Items ────────────────────────────────────────────────────────────────

const TOP_ITEM_IDS = ["1", "8", "3"] as const;
const SOLD_COUNTS: Record<string, number> = { "1": 85, "8": 62, "3": 45 };

export const TOP_MENU_ITEMS: TopMenuItem[] = TOP_ITEM_IDS.map((id) => {
  const item = MENU_ITEMS.find((m) => m.id === id)!;
  return { ...item, soldCount: SOLD_COUNTS[id] };
});

// ─── Mock Queue Orders ────────────────────────────────────────────────────────

export const MOCK_QUEUE_ORDERS: QueueOrder[] = [
  {
    id: "#A-001",
    customerName: "Budi Santoso",
    className: "XII IPA 1",
    slot: "break1",
    status: "PREPARING",
    items: ["2x Classic Cheeseburger", "1x Es Teh Manis"],
  },
  {
    id: "#A-002",
    customerName: "Dewi Rahayu",
    className: "XI IPS 2",
    slot: "break1",
    status: "READY",
    items: ["1x Nasi Goreng Spesial", "1x Iced Latte"],
  },
  {
    id: "#A-003",
    customerName: "Eko Prasetyo",
    className: "X MIPA 3",
    slot: "break2",
    status: "PREPARING",
    items: ["1x Ayam Geprek", "1x Jus Alpukat Susu"],
  },
  {
    id: "#A-004",
    customerName: "Sari Indah",
    className: "XI IPA 2",
    slot: "break1",
    status: "PREPARING",
    items: ["1x Mie Goreng", "2x Pisang Goreng Crispy"],
  },
];

export const MOCK_PENDING_COUNT = MOCK_QUEUE_ORDERS.filter(
  (o) => o.status === "PREPARING",
).length;

// ─── Mock Report Data ─────────────────────────────────────────────────────────

export const MOCK_DAILY_REPORTS: DailyReport[] = [
  { date: "2026-03-05", orders: 42, revenue: 756000 },
  { date: "2026-03-04", orders: 38, revenue: 684000 },
  { date: "2026-03-03", orders: 51, revenue: 918000 },
  { date: "2026-03-02", orders: 45, revenue: 810000 },
  { date: "2026-03-01", orders: 33, revenue: 594000 },
  { date: "2026-02-28", orders: 27, revenue: 486000 },
  { date: "2026-02-27", orders: 49, revenue: 882000 },
  { date: "2026-02-26", orders: 44, revenue: 792000 },
  { date: "2026-02-25", orders: 36, revenue: 648000 },
  { date: "2026-02-24", orders: 53, revenue: 954000 },
  { date: "2026-02-23", orders: 40, revenue: 720000 },
  { date: "2026-02-22", orders: 29, revenue: 522000 },
  { date: "2026-02-21", orders: 47, revenue: 846000 },
  { date: "2026-02-20", orders: 55, revenue: 990000 },
];

export const MOCK_REPORT_ORDERS: ReportOrder[] = [
  { id: "#A-001", customerName: "Budi Santoso",    className: "XII IPA 1",  items: ["2x Classic Cheeseburger", "1x Es Teh Manis"],         total: 55000,  date: "2026-03-05", slot: "break1" },
  { id: "#A-002", customerName: "Dewi Rahayu",     className: "XI IPS 2",   items: ["1x Nasi Goreng Spesial", "1x Iced Latte"],            total: 35000,  date: "2026-03-05", slot: "break1" },
  { id: "#A-003", customerName: "Eko Prasetyo",    className: "X MIPA 3",   items: ["1x Ayam Geprek", "1x Jus Alpukat Susu"],              total: 30000,  date: "2026-03-05", slot: "break2" },
  { id: "#A-004", customerName: "Sari Indah",      className: "XI IPA 2",   items: ["1x Mie Goreng", "2x Pisang Goreng Crispy"],           total: 31000,  date: "2026-03-05", slot: "break1" },
  { id: "#A-005", customerName: "Rizky Maulana",   className: "XII IPS 1",  items: ["1x Salad Buah Segar", "1x Smoothie Hijau"],           total: 27000,  date: "2026-03-04", slot: "break2" },
  { id: "#A-006", customerName: "Nurul Hidayah",   className: "X IPA 1",    items: ["2x Kentang Goreng", "1x Es Teh Manis"],               total: 25000,  date: "2026-03-04", slot: "break1" },
  { id: "#A-007", customerName: "Fajar Setiawan",  className: "XI MIPA 2",  items: ["1x Classic Cheeseburger", "1x Iced Latte"],           total: 40000,  date: "2026-03-04", slot: "break1" },
  { id: "#A-008", customerName: "Maya Putri",      className: "XII IPA 3",  items: ["1x Nasi Goreng Spesial", "1x Pisang Goreng Crispy"],  total: 28000,  date: "2026-03-03", slot: "break2" },
  { id: "#A-009", customerName: "Hendra Kusuma",   className: "X IPS 3",    items: ["2x Ayam Geprek", "2x Es Teh Manis"],                  total: 46000,  date: "2026-03-03", slot: "break1" },
  { id: "#A-010", customerName: "Intan Permata",   className: "XI IPA 3",   items: ["1x Jus Alpukat Susu", "1x Salad Buah Segar"],         total: 24000,  date: "2026-03-03", slot: "break2" },
];
