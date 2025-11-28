"use client";

interface ProbabilityIndicatorProps {
  percentage: number;
  showLabel?: boolean;
}

export function ProbabilityIndicator({ percentage, showLabel = true }: ProbabilityIndicatorProps) {
  const getColor = (prob: number) => {
    if (prob >= 70) return "bg-green-500";
    if (prob >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = (prob: number) => {
    if (prob >= 70) return "text-green-700 dark:text-green-300";
    if (prob >= 40) return "text-yellow-700 dark:text-yellow-300";
    return "text-red-700 dark:text-red-300";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(percentage)} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${getTextColor(percentage)}`}>
          {percentage}%
        </span>
      )}
    </div>
  );
}

