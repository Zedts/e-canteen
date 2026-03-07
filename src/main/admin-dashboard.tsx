import { AdminShell } from "@/src/components/admin/admin-shell";
import { DashboardStats } from "@/src/components/admin/dashboard-stats";
import type { AdminStats } from "@/src/types/admin";

interface AdminDashboardProps {
  stats: AdminStats | null;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const operationalDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AdminShell activePage="dashboard">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Ringkasan keseluruhan platform E-Canteen.
            </p>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm shrink-0">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
              Tanggal
            </p>
            <p className="text-sm font-bold text-gray-900 capitalize">{operationalDate}</p>
          </div>
        </div>

        <DashboardStats stats={stats} />
      </div>
    </AdminShell>
  );
}
