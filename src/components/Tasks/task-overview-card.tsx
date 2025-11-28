"use client";

import { ReactNode } from "react";

interface TaskOverviewCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  color: "red" | "orange" | "yellow" | "green" | "blue";
  onClick?: () => void;
}

const colorClasses = {
  red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
};

const textColorClasses = {
  red: "text-red-700 dark:text-red-300",
  orange: "text-orange-700 dark:text-orange-300",
  yellow: "text-yellow-700 dark:text-yellow-300",
  green: "text-green-700 dark:text-green-300",
  blue: "text-blue-700 dark:text-blue-300",
};

export function TaskOverviewCard({
  title,
  count,
  icon,
  color,
  onClick,
}: TaskOverviewCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${colorClasses[color]} ${
        onClick ? "hover:scale-105" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${textColorClasses[color]}`}>
            {count}
          </p>
        </div>
        <div className={`text-3xl ${textColorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

