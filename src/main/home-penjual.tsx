import { DashboardPage } from "@/src/components/penjual/dashboard-page";
import { PenjualShell } from "@/src/components/penjual/penjual-shell";
import type { StatData, TopMenuItem } from "@/src/types/penjual";

interface Props {
  pendingCount: number;
  stats: StatData[];
  chartData: { labels: string[]; values: number[] };
  topItems: TopMenuItem[];
}

export default function HomePenjual({ pendingCount, stats, chartData, topItems }: Props) {
  return (
    <PenjualShell activePage="dashboard" pendingOrderCount={pendingCount}>
      <DashboardPage stats={stats} chartData={chartData} topItems={topItems} />
    </PenjualShell>
  );
}
