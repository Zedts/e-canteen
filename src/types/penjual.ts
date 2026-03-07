import type { Product } from "@/src/types/product";

export type PenjualPage = "dashboard" | "queue" | "menu" | "laporan";

export type QueueOrderStatus = "PREPARING" | "READY";

export interface QueueOrder {
  id: string;
  customerName: string;
  slot: "break1" | "break2";
  status: QueueOrderStatus;
  items: string[];
}

// ─── Dashboard Types ───────────────────────────────────────────────────────────
export interface StatData {
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
  trend?: { label: string; positive: boolean };
}

export interface TopMenuItem extends Product {
  soldCount: number;
}

// ─── Report Types ─────────────────────────────────────────────────────────────
export interface DailyReport {
  date: string;    // "YYYY-MM-DD"
  orders: number;
  revenue: number;
}

export interface ReportOrder {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  date: string;    // "YYYY-MM-DD"
  slot: "break1" | "break2";
}
