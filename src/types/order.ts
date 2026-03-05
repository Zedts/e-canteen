import type { MenuItem } from "@/src/lib/menu-data";

export type Cart = Record<string, number>; // itemId → quantity

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}
