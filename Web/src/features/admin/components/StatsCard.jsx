import { TrendingUp, TrendingDown } from "lucide-react";

const colorMap = {
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: "text-green-600 dark:text-green-400",
    accent: "from-green-500 to-emerald-600",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
    accent: "from-blue-500 to-cyan-600",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
    accent: "from-amber-500 to-orange-600",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-950/30",
    icon: "text-rose-600 dark:text-rose-400",
    accent: "from-rose-500 to-pink-600",
  },
  violet: {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
    accent: "from-violet-500 to-purple-600",
  },
  forest: {
    bg: "bg-green-100/80 dark:bg-green-950/20",
    icon: "text-(--color-primary-700) dark:text-green-400",
    accent: "from-(--color-primary-700) to-emerald-700",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    accent: "from-emerald-500 to-teal-600",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-950/30",
    icon: "text-teal-600 dark:text-teal-400",
    accent: "from-teal-500 to-cyan-600",
  },
  mint: {
    bg: "bg-emerald-50 dark:bg-emerald-950/15",
    icon: "text-emerald-500 dark:text-emerald-300",
    accent: "from-emerald-400 to-teal-500",
  },
  lime: {
    bg: "bg-lime-50 dark:bg-lime-950/15",
    icon: "text-lime-600 dark:text-lime-450",
    accent: "from-lime-500 to-emerald-500",
  },
  brand: {
    bg: "bg-(--color-primary-600)/10 dark:bg-(--color-primary-600)/20",
    icon: "text-(--color-primary-600) dark:text-(--color-primary-600)/90",
    accent: "from-(--color-primary-600) to-(--color-primary-800)",
  },
};

export default function StatsCard({
  title,
  value,
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  trend,
  trendLabel = "from last month",
  color = "green",
}) {
  const palette = colorMap[color] || colorMap.green;
  const isPositive = trend > 0;
  const hasTrend = trend !== undefined && trend !== null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-(--color-border-base) dark:border-(--color-border-subtle) bg-(--color-surface-card) dark:bg-(--color-panel-dark) p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${palette.accent} opacity-80`}
      />

      <div className="flex items-start justify-between mb-3 pt-1">
        <div>
          <p className="text-sm font-medium text-(--color-text-secondary) dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-(--color-text-primary) dark:text-white tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl ${palette.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-5 h-5 ${palette.icon}`} />
        </div>
      </div>

      {hasTrend && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-rose-500" />
          )}
          <span
            className={`text-sm font-semibold ${isPositive ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}`}
          >
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}
