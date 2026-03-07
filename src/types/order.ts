import type { Product } from "@/src/types/product";

export type Cart = Record<string, number>; // productId → quantity

export interface CartEntry {
  item: Product;
  quantity: number;
}
