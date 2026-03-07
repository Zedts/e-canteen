export type PenjualPage = "dashboard" | "queue" | "menu" | "laporan";

export type QueueOrderStatus = "PREPARING" | "READY";

export interface QueueOrder {
  id: string;
  customerName: string;
  className: string;
  slot: "break1" | "break2";
  status: QueueOrderStatus;
  items: string[];
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
  className: string;
  items: string[];
  total: number;
  date: string;    // "YYYY-MM-DD"
  slot: "break1" | "break2";
}
