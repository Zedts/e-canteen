"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useCart } from "@/src/hooks/use-cart";
import type { Product } from "@/src/types/product";
import type { Cart, CartEntry } from "@/src/types/order";

const STORAGE_KEY = "ecanteen_cart";

interface CartContextValue {
  cart: Cart;
  cartEntries: CartEntry[];
  cartTotal: number;
  totalItems: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  removeAll: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): Cart {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Cart) : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children, products }: { children: ReactNode; products: Product[] }) {
  const { cart, add, remove, removeAll, clear, restore, totalItems } = useCart();

  // Hydrate from sessionStorage on first client render
  useEffect(() => {
    const saved = loadCart();
    if (Object.keys(saved).length > 0) restore(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist every cart change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartEntries: CartEntry[] = products
    .filter((p) => (cart[p.id] ?? 0) > 0)
    .map((p) => ({ item: p, quantity: cart[p.id] }));

  const cartTotal = cartEntries.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ cart, cartEntries, cartTotal, totalItems, add, remove, removeAll, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside <CartProvider>");
  return ctx;
}
