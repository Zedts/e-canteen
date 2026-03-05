import { MENU_ITEMS, type MenuItem } from "./menu-data";
import type { QueueOrder } from "@/src/types/admin";

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
