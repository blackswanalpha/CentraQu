"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, DollarSign, Percent } from "lucide-react";

interface QuickStatsProps {
  totalPipeline: number;
  weightedPipeline: number;
  wonThisMonth: number;
  conversionRate: number;
  loading?: boolean;
}

const StatIcon = ({ type }: { type: 'pipeline' | 'weighted' | 'won' | 'conversion' }) => {
  const icons = {
    pipeline: DollarSign,
    weighted: Target,
    won: TrendingUp,
    conversion: Percent,
  };
  const IconComponent = icons[type];
  return <IconComponent className="h-5 w-5" />;
};

export function QuickStats({
  totalPipeline,
  weightedPipeline,
  wonThisMonth,
  conversionRate,
  loading = false,
}: QuickStatsProps) {
  const stats = [
    {
      label: "Total Pipeline",
      value: totalPipeline,
      formatted: `$${(totalPipeline / 1000).toFixed(0)}K`,
      icon: 'pipeline' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: "Weighted",
      value: weightedPipeline,
      formatted: `$${(weightedPipeline / 1000).toFixed(0)}K`,
      icon: 'weighted' as const,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: "Won this month",
      value: wonThisMonth,
      formatted: `$${(wonThisMonth / 1000).toFixed(0)}K`,
      icon: 'won' as const,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: "Conversion",
      value: conversionRate,
      formatted: `${conversionRate.toFixed(1)}%`,
      icon: 'conversion' as const,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          QUICK STATS
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg font-semibold text-dark dark:text-white mb-4"
      >
        QUICK STATS
      </motion.h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className={`flex items-center justify-between p-3 rounded-lg ${stat.bgColor} hover:scale-105 transition-transform duration-200 cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white dark:bg-gray-800 ${stat.color}`}>
                <StatIcon type={stat.icon} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.label}:
              </span>
            </div>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + (index * 0.1), type: "spring" }}
              className={`text-lg font-bold ${stat.color}`}
            >
              {stat.formatted}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

