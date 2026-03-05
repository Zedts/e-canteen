import { db } from "./db";
import type { OrderWithItems } from "@/src/types/history";

export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  return db.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Safe variant for server pages — never throws.
 * Returns null when the DB is unreachable or tables don't exist yet
 * (e.g. migration not yet applied), so the page can render a degraded state
 * instead of crashing with a 500.
 */
export async function getUserOrdersSafe(
  userId: string,
): Promise<OrderWithItems[] | null> {
  try {
    return await getUserOrders(userId);
  } catch {
    return null;
  }
}
