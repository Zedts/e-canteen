import type { Order, OrderItem } from "@/src/generated/prisma/client";
import type { OrderStatus } from "@/src/generated/prisma/enums";

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type HistoryFilter = "all" | "active" | "completed";

export type { OrderStatus };

const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "PREPARING", "READY"];

export function isActiveOrder(status: OrderStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

export function matchesFilter(
  status: OrderStatus,
  filter: HistoryFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "active") return isActiveOrder(status);
  return !isActiveOrder(status);
}
