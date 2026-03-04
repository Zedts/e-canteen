"use client";

import { Home, ShoppingBag, ClipboardList } from "lucide-react";

const TABS = [
  { key: "home",     label: "Beranda",  Icon: Home },
  { key: "preorder", label: "Pesan",   Icon: ShoppingBag },
  { key: "history",  label: "Riwayat", Icon: ClipboardList },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface BottomNavProps {
  active?: TabKey;
}

export function BottomNav({ active = "home" }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/60 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={[
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              active === key ? "text-brand-500" : "text-gray-400 hover:text-gray-600",
            ].join(" ")}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
