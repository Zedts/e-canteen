"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { ORDER_CHART_DATA } from "@/src/lib/mock-dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const BRAND_COLOR = "#f59e0b";
const BRAND_FILL = "rgba(245, 158, 11, 0.2)";

const chartData: ChartData<"line"> = {
  labels: ORDER_CHART_DATA.labels,
  datasets: [
    {
      label: "Pesanan",
      data: ORDER_CHART_DATA.values,
      borderColor: BRAND_COLOR,
      borderWidth: 3,
      backgroundColor: BRAND_FILL,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#fff",
      pointBorderColor: BRAND_COLOR,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#111827",
      padding: 12,
      titleFont: { family: "Inter", size: 13 },
      bodyFont: { family: "Inter", size: 13 },
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: "#6b7280", font: { family: "Inter" } },
    },
    y: {
      grid: { color: "#f3f4f6" },
      border: { display: false, dash: [4, 4] },
      ticks: { color: "#6b7280", font: { family: "Inter" }, padding: 10 },
    },
  },
};

export function OrdersChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
      <h3 className="font-serif font-bold text-lg text-gray-900 mb-6">
        Volume Pesanan Hari Ini
      </h3>
      <div className="relative h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
