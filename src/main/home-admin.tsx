"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Clock } from "lucide-react";
import { AdminSidebar } from "@/src/components/admin/admin-sidebar";
import { AdminHeader } from "@/src/components/admin/admin-header";
import { DashboardPage } from "@/src/components/admin/dashboard-page";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import type { AdminPage } from "@/src/types/admin";

// Placeholder for pages not yet implemented
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Clock className="w-12 h-12 text-gray-300 mb-4" />
      <h2 className="font-serif text-2xl font-bold text-gray-600 mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-400">
        Halaman ini sedang dalam pengembangan.
      </p>
    </div>
  );
}

function PageContent({ page }: { page: AdminPage }) {
  switch (page) {
    case "dashboard":
      return <DashboardPage />;
    case "queue":
      return <ComingSoonPage title="Antrean Pesanan" />;
    case "menu":
      return <ComingSoonPage title="Manajemen Menu" />;
  }
}

// Hardcoded for now; will come from DB when queue page is implemented
const PENDING_ORDER_COUNT = 3;

export default function HomeAdmin() {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <AdminSidebar
        activePage={activePage}
        pendingOrderCount={PENDING_ORDER_COUNT}
        isMobileOpen={isMobileMenuOpen}
        onNavigate={setActivePage}
        onLogout={() => setShowLogoutDialog(true)}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <PageContent page={activePage} />
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