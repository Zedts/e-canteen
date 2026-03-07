"use client";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import { cn, getInitials } from "@/src/lib/utils";
import type { AdminPage } from "@/src/types/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  id: AdminPage;
  label: string;
  icon: LucideIcon;
}

interface AdminSidebarProps {
  activePage: AdminPage;
  isMobileOpen: boolean;
  isCollapsed: boolean;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { id: "users",           label: "Kelola Pengguna", icon: Users },
  { id: "daftar-penjual",  label: "Daftar Penjual",  icon: UserPlus },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar({
  activePage,
  isMobileOpen,
  isCollapsed,
  onNavigate,
  onLogout,
  onMobileClose,
  onToggleCollapse,
}: AdminSidebarProps) {
  const { data: session } = useSession();
  const adminName = session?.user?.name ?? "Admin";

  function handleNavigate(page: AdminPage) {
    onNavigate(page);
    onMobileClose();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-55 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col w-64",
          "fixed inset-y-0 left-0 z-60 transition-[transform,width] duration-300",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-18" : "lg:w-64",
        )}
      >
        {/* Logo / Header */}
        <div
          className={cn(
            "border-b border-gray-100 flex items-center",
            isCollapsed ? "lg:justify-center p-3" : "px-6 py-5 justify-between",
          )}
        >
          <div className={cn(isCollapsed && "lg:hidden")}>
            <h1 className="font-serif font-bold text-2xl tracking-tight text-gray-900">
              E-Kantin<span className="text-brand-500">.</span>
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
              Portal Admin
            </p>
          </div>

          {/* Collapse / expand toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden text-gray-500 hover:text-gray-800 p-1 rounded-lg transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1", isCollapsed ? "lg:p-2 p-3" : "p-3")}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;

            return (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                title={isCollapsed ? label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isCollapsed && "lg:justify-center lg:px-0",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={cn("flex-1 text-left truncate", isCollapsed && "lg:hidden")}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer: user info + logout */}
        <div
          className={cn(
            "border-t border-gray-100",
            isCollapsed ? "lg:p-2 p-4" : "p-4",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              isCollapsed && "lg:hidden",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {getInitials(adminName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{adminName}</p>
              <p className="text-[10px] text-gray-500">Admin</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title={isCollapsed ? "Keluar" : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors",
              isCollapsed && "lg:justify-center lg:px-0",
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={cn(isCollapsed && "lg:hidden")}>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
