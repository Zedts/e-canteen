"use client";

import { useState } from "react";
import { Navbar } from "@/src/components/home/navbar";
import { BottomNav } from "@/src/components/home/bottom-nav";
import { CategoryFilter } from "@/src/components/home/category-filter";
import { TimeSlotPicker } from "@/src/components/order/time-slot-picker";
import { OrderMenuCard } from "@/src/components/order/order-menu-card";
import { CartSidebar } from "@/src/components/order/cart-sidebar";
import { CartCheckoutBar } from "@/src/components/order/cart-checkout-bar";
import { CheckoutStep } from "@/src/components/order/checkout-step";
import { useCartContext } from "@/src/context/cart-context";
import {
  MENU_ITEMS,
  MENU_CATEGORIES,
  TIME_SLOTS,
  type MenuCategory,
  type TimeSlot,
} from "@/src/lib/menu-data";

interface OrderProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    balance: number;
    role: "USER" | "PENJUAL" | "ADMIN";
  };
}

type OrderStep = "selecting" | "checkout";

export default function Order({ user }: OrderProps) {
  const [step, setStep] = useState<OrderStep>("selecting");
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(
    MENU_CATEGORIES[0],
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>(TIME_SLOTS[0]);
  const { cart, cartEntries, cartTotal, totalItems, add, remove, removeAll } =
    useCartContext();

  const filteredItems = MENU_ITEMS.filter(
    (item) => item.category === activeCategory,
  );

  if (step === "checkout") {
    return (
      <CheckoutStep
        user={user}
        slot={selectedSlot}
        onBack={() => setStep("selecting")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar user={user} activePage="preorder" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start animate-fade-in">
          {/* Left column: time slot + menu */}
          <div className="flex-1 w-full flex flex-col gap-10">
            <TimeSlotPicker
              slots={TIME_SLOTS}
              selected={selectedSlot}
              onSelect={setSelectedSlot}
            />

            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                Menu Hari Ini
              </h2>

              <CategoryFilter
                active={activeCategory}
                onChange={setActiveCategory}
              />

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredItems.map((item) => (
                  <OrderMenuCard
                    key={item.id}
                    item={item}
                    quantity={cart[item.id] ?? 0}
                    onAdd={() => add(item.id)}
                    onRemove={() => remove(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: desktop cart */}
          <CartSidebar
            entries={cartEntries}
            slot={selectedSlot}
            total={cartTotal}
            onAdd={add}
            onRemove={remove}
            onRemoveAll={removeAll}
            onCheckout={() => setStep("checkout")}
          />
        </div>
      </main>

      {/* Mobile: sticky checkout action bar */}
      <CartCheckoutBar
        totalItems={totalItems}
        cartTotal={cartTotal}
        onCheckout={() => setStep("checkout")}
      />

      <BottomNav active="preorder" />
    </div>
  );
}
