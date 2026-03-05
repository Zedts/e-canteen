import { DashboardPage } from "@/src/components/admin/dashboard-page";
import { AdminShell } from "@/src/components/admin/admin-shell";

export default function HomeAdmin() {
  return (
    <AdminShell activePage="dashboard">
      <DashboardPage />
    </AdminShell>
  );
}