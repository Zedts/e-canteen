import { DashboardPage } from "@/src/components/admin/dashboard-page";
import { AdminShell } from "@/src/components/admin/admin-shell";
import { MOCK_PENDING_COUNT } from "@/src/lib/mock-dashboard";

export default function HomeAdmin() {
  return (
    <AdminShell activePage="dashboard" pendingOrderCount={MOCK_PENDING_COUNT}>
      <DashboardPage />
    </AdminShell>
  );
}