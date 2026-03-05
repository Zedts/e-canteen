"use client";

import { LayoutDashboard, ClipboardList, BookOpen, LogOut, X } from "lucide-react";
import { useSession } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getInitials } from "@/src/lib/utils";
import type { AdminPage } from "@/src/types/admin";

interface NavItem {
  id: AdminPage;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface AdminSidebarProps {
  activePage: AdminPage;
  pendingOrderCount: number;
  isMobileOpen: boolean;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  onMobileClose: () => void;
}

export function AdminSidebar({
  activePage,
  pendingOrderCount,
  isMobileOpen,
  onNavigate,
  onLogout,
  onMobileClose,
}: AdminSidebarProps) {
  const { data: session } = useSession();
  const adminName = session?.user?.name ?? "Administrator";

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "queue",
      label: "Antrean Pesanan",
      icon: ClipboardList,
      badge: pendingOrderCount,
    },
    { id: "menu", label: "Manajemen Menu", icon: BookOpen },
  ];

  function handleNavigate(page: AdminPage) {
    onNavigate(page);
    onMobileClose();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "w-64 bg-white border-r border-gray-200 flex flex-col",
          "fixed inset-y-0 left-0 z-[60] transition-transform duration-300",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="font-serif font-bold text-2xl tracking-tight text-gray-900">
              E-Kantin<span className="text-brand-500">.</span>
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
              Portal Admin
            </p>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden text-gray-500 hover:text-gray-800 p-1 rounded-lg transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl",
                  "text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  {label}
                </div>
                {badge !== undefined && badge > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-red-500 text-white",
                    )}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: user + logout */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {getInitials(adminName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {adminName}
              </p>
              <p className="text-[10px] text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
