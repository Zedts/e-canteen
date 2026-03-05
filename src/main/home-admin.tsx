"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { AdminSidebar } from "@/src/components/admin/admin-sidebar";
import { AdminHeader } from "@/src/components/admin/admin-header";
import { DashboardPage } from "@/src/components/admin/dashboard-page";
import { QueuePage } from "@/src/components/admin/queue-page";
import { MenuPage } from "@/src/components/admin/menu-page";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { MOCK_QUEUE_ORDERS } from "@/src/lib/mock-dashboard";
import type { AdminPage, QueueOrder } from "@/src/types/admin";

// ─── Page router ──────────────────────────────────────────────────────────────

interface PageContentProps {
  page: AdminPage;
  queueOrders: QueueOrder[];
  onMarkReady: (id: string) => void;
  onCompleteOrder: (id: string) => void;
}

function PageContent({
  page,
  queueOrders,
  onMarkReady,
  onCompleteOrder,
}: PageContentProps) {
  switch (page) {
    case "dashboard":
      return <DashboardPage />;
    case "queue":
      return (
        <QueuePage
          orders={queueOrders}
          onMarkReady={onMarkReady}
          onComplete={onCompleteOrder}
        />
      );
    case "menu":
      return <MenuPage />;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeAdmin() {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [queueOrders, setQueueOrders] = useState<QueueOrder[]>(MOCK_QUEUE_ORDERS);

  const pendingOrderCount = queueOrders.filter(
    (o) => o.status === "PREPARING",
  ).length;

  function markReady(id: string) {
    setQueueOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "READY" as const } : o)),
    );
  }

  function completeOrder(id: string) {
    setQueueOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <AdminSidebar
        activePage={activePage}
        pendingOrderCount={pendingOrderCount}
        isMobileOpen={isMobileMenuOpen}
        isCollapsed={isSidebarCollapsed}
        onNavigate={setActivePage}
        onLogout={() => setShowLogoutDialog(true)}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <PageContent
            page={activePage}
            queueOrders={queueOrders}
            onMarkReady={markReady}
            onCompleteOrder={completeOrder}
          />
        </main>
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