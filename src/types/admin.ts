export type AdminPage = "dashboard" | "queue" | "menu";

export type QueueOrderStatus = "PREPARING" | "READY";

export interface QueueOrder {
  id: string;
  customerName: string;
  className: string;
  slot: "break1" | "break2";
  status: QueueOrderStatus;
  items: string[];
}
