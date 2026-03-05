"use client";

import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { getInitials } from "@/src/lib/utils";

interface AdminHeaderProps {
  onMenuOpen: () => void;
}

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const { data: session } = useSession();
  const initials = getInitials(session?.user?.name ?? "A");

  return (
    <header className="lg:hidden sticky top-0 glass border-b border-gray-200 z-40 px-4 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="text-gray-600 hover:text-brand-500 transition-colors"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-serif font-bold text-xl tracking-tight">
          E-Kantin<span className="text-brand-500">.</span>
        </span>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
        {initials}
      </div>
    </header>
  );
}
