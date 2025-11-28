import { cn } from "@/lib/utils";
import type { JSX, SVGProps } from "react";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  status?: "normal" | "warning" | "critical";
  iconColor?: "primary" | "success" | "accent" | "error" | "info";
  index?: number; // For staggered animations
}

export function KPICard({
  title,
  value,
  trend,
  icon: Icon,
  status = "normal",
  iconColor = "primary",
  index = 0,
}: KPICardProps) {
  // Status-based styling
  const statusStyles = {
    normal: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md",
    warning: "bg-orange-50 dark:bg-orange-950/20 border-accent dark:border-accent/50 hover:shadow-md",
    critical: "bg-red-50 dark:bg-red-950/20 border-error dark:border-error/50 hover:shadow-md",
  };

  // Icon background colors
  const iconBackgroundColors = {
    primary: "bg-primary/10 dark:bg-primary/20",
    success: "bg-success/10 dark:bg-success/20",
    accent: "bg-accent/10 dark:bg-accent/20",
    error: "bg-error/10 dark:bg-error/20",
    info: "bg-blue-100 dark:bg-blue-900/30",
  };

  // Icon text colors
  const iconTextColors = {
    primary: "text-primary",
    success: "text-success",
    accent: "text-accent",
    error: "text-error",
    info: "text-blue-600 dark:text-blue-400",
  };

  // Trend colors
  const trendColors = {
    positive: "text-success",
    negative: "text-error",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.21, 1.02, 0.73, 1]
      }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "rounded-[10px] border p-6 shadow-1 transition-all duration-200 cursor-pointer",
        statusStyles[status]
      )}
    >
      {/* Icon and Title Row */}
      <div className="flex items-start justify-between">
        {Icon && (
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              iconBackgroundColors[iconColor]
            )}
          >
            <Icon
              className={cn("h-7 w-7", iconTextColors[iconColor])}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Status Badge */}
        {status !== "normal" && (
          <div
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              status === "warning"
                ? "bg-accent/20 text-accent dark:bg-accent/30"
                : "bg-error/20 text-error dark:bg-error/30"
            )}
          >
            {status === "warning" ? "Warning" : "Critical"}
          </div>
        )}
      </div>

      {/* Value and Label */}
      <div className="mt-6">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index * 0.1) + 0.2 }}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 font-poppins"
        >
          {title}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (index * 0.1) + 0.3, type: "spring" }}
          className="mt-2 text-3xl font-bold text-dark dark:text-white font-poppins"
        >
          {value}
        </motion.p>
      </div>

      {/* Trend Indicator */}
      {trend && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (index * 0.1) + 0.4 }}
          className="mt-4 flex items-center gap-1.5"
        >
          <span
            className={cn(
              "text-sm font-medium font-poppins",
              trend.isPositive ? trendColors.positive : trendColors.negative
            )}
          >
            {trend.isPositive ? (
              <span className="inline-flex items-center gap-1">
                <span>↑</span>
                <span>{Math.abs(trend.value)}%</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <span>↓</span>
                <span>{Math.abs(trend.value)}%</span>
              </span>
            )}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
            vs last month
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

