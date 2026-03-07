import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { StatData } from "@/src/lib/mock-dashboard";

interface StatCardProps {
  stat: StatData;
  icon: LucideIcon;
}

export function StatCard({ stat, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft">
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
          stat.iconBg,
          stat.iconColor,
        )}
      >
        <Icon className="w-6 h-6" />
      </div>

      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>

      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
        {stat.trend && (
          <span
            className={cn(
              "flex items-center text-xs font-bold mb-1",
              stat.trend.positive ? "text-green-600" : "text-red-500",
            )}
          >
            {stat.trend.positive ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            )}
            {stat.trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
