import { MENU_ITEMS, type MenuItem } from "./menu-data";

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
