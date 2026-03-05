"use client";

import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
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
  badge?: number;
}

interface AdminSidebarProps {
  activePage: AdminPage;
  pendingOrderCount: number;
  isMobileOpen: boolean;
  isCollapsed: boolean;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar({
  activePage,
  pendingOrderCount,
  isMobileOpen,
  isCollapsed,
  onNavigate,
  onLogout,
  onMobileClose,
  onToggleCollapse,
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
          "bg-white border-r border-gray-200 flex flex-col w-64",
          "fixed inset-y-0 left-0 z-[60] transition-[transform,width] duration-300",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-[72px]" : "lg:w-64",
        )}
      >
        {/* Logo / Header */}
        <div
          className={cn(
            "border-b border-gray-100 flex items-center",
            isCollapsed ? "lg:justify-center p-4" : "p-6 justify-between",
          )}
        >
          {/* Full logo — visible on mobile and expanded desktop */}
          <div className={cn(isCollapsed && "lg:hidden")}>
            <h1 className="font-serif font-bold text-2xl tracking-tight text-gray-900">
              E-Kantin<span className="text-brand-500">.</span>
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
              Portal Admin
            </p>
          </div>

          {/* Icon mark — only visible when collapsed on desktop */}
          <div className={cn("hidden", isCollapsed && "lg:block")}>
            <span className="font-serif font-bold text-2xl tracking-tight text-gray-900">
              E<span className="text-brand-500">.</span>
            </span>
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activePage === id;
            const hasVisibleBadge = badge !== undefined && badge > 0;

            return (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                title={isCollapsed ? label : undefined}
                className={cn(
                  "w-full flex items-center py-3 rounded-xl text-sm font-medium transition-colors",
                  isCollapsed
                    ? "lg:justify-center lg:px-0 px-4 justify-start gap-3"
                    : "px-4 justify-between",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {/* Icon + optional badge dot (collapsed) + label */}
                <div className="relative flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  {hasVisibleBadge && (
                    <span
                      className={cn(
                        "absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-red-500",
                        isCollapsed ? "hidden lg:block" : "hidden",
                      )}
                    />
                  )}
                  <span className={cn(isCollapsed && "lg:hidden")}>{label}</span>
                </div>

                {/* Inline badge count — only when expanded */}
                {hasVisibleBadge && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                      isActive ? "bg-white/20 text-white" : "bg-red-500 text-white",
                      isCollapsed && "lg:hidden",
                    )}
                  >
                    {badge}
                  </span>
                )}
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
          {/* User info — hidden when collapsed on desktop */}
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
              <p className="text-sm font-bold text-gray-900 truncate">
                {adminName}
              </p>
              <p className="text-[10px] text-gray-500">Administrator</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            title={isCollapsed ? "Keluar" : undefined}
            className={cn(
              "w-full flex items-center gap-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors",
              isCollapsed ? "lg:justify-center lg:px-0 px-4" : "px-4",
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
