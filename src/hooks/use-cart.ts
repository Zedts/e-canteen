"use client";

import { useState, useCallback } from "react";
import type { Cart } from "@/src/types/order";

export function useCart() {
  const [cart, setCart] = useState<Cart>({});

  const add = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }, []);

  const remove = useCallback((id: string) => {
    setCart((c) => {
      const next = { ...c };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const clear = useCallback(() => setCart({}), []);

  // Used by CartContext to bulk-restore a persisted cart snapshot
  const restore = useCallback((snapshot: Cart) => setCart(snapshot), []);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return { cart, add, remove, clear, restore, totalItems };
}
