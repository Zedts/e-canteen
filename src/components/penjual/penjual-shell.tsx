"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PenjualSidebar } from "./penjual-sidebar";
import { PenjualHeader } from "./penjual-header";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import type { PenjualPage } from "@/src/types/penjual";

// ─── Route map ────────────────────────────────────────────────────────────────

const PAGE_ROUTES: Record<PenjualPage, string> = {
  dashboard: "/home-penjual",
  queue: "/penjual-queue",
  menu: "/penjual-menu",
  laporan: "/penjual-laporan",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface PenjualShellProps {
  activePage: PenjualPage;
  pendingOrderCount?: number;
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PenjualShell({
  activePage,
  pendingOrderCount = 0,
  children,
}: PenjualShellProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  function navigateTo(page: PenjualPage) {
    router.push(PAGE_ROUTES[page]);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <PenjualSidebar
        activePage={activePage}
        pendingOrderCount={pendingOrderCount}
        isMobileOpen={isMobileMenuOpen}
        isCollapsed={isSidebarCollapsed}
        onNavigate={navigateTo}
        onLogout={() => setShowLogoutDialog(true)}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <PenjualHeader onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      <ConfirmDialog
        open={showLogoutDialog}
        title="Keluar dari akun?"
        description="Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login."
        confirmLabel="Keluar"
        cancelLabel="Batal"
        variant="destructive"
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}
