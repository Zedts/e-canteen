import { DashboardPage } from "@/src/components/penjual/dashboard-page";
import { PenjualShell } from "@/src/components/penjual/penjual-shell";
import { MOCK_PENDING_COUNT } from "@/src/lib/mock-dashboard";

export default function HomePenjual() {
  return (
    <PenjualShell activePage="dashboard" pendingOrderCount={MOCK_PENDING_COUNT}>
      <DashboardPage />
    </PenjualShell>
  );
}