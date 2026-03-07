import { Users, Store, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { AdminStats } from "@/src/types/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatConfig {
  label: string;
  getValue: (stats: AdminStats) => string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAT_CONFIGS: StatConfig[] = [
  {
    label:    "Total Pengguna",
    getValue: (s) => String(s.totalUsers),
    icon:     Users,
    iconBg:   "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label:    "Total Penjual",
    getValue: (s) => String(s.totalPenjual),
    icon:     Store,
    iconBg:   "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    label:    "Total Pesanan",
    getValue: (s) => String(s.totalOrders),
    icon:     ShoppingBag,
    iconBg:   "bg-green-50",
    iconColor: "text-green-600",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="font-bold text-gray-900 text-2xl mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DashboardStatsProps {
  stats: AdminStats | null;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 text-sm text-yellow-800">
        Data statistik tidak tersedia saat ini. Pastikan koneksi database aktif.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {STAT_CONFIGS.map((config) => (
        <StatCard
          key={config.label}
          label={config.label}
          value={config.getValue(stats)}
          icon={config.icon}
          iconBg={config.iconBg}
          iconColor={config.iconColor}
        />
      ))}
    </div>
  );
}
