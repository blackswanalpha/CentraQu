import { WidgetCard } from "@/components/Dashboard/widget-card";
import { ProgressBar } from "@/components/Dashboard/progress-bar";

interface PipelineWidgetProps {
  totalPipeline: number;
  opportunityCount: number;
  weightedForecast: number;
  quarterTarget: number;
  coverageRatio: number;
  winRate: number;
}

export function PipelineWidget({
  totalPipeline,
  opportunityCount,
  weightedForecast,
  quarterTarget,
  coverageRatio,
  winRate,
}: PipelineWidgetProps) {
  const targetProgress = (weightedForecast / quarterTarget) * 100;
  const pipelineCoverage = (totalPipeline / quarterTarget) * 100;

  return (
    <WidgetCard title="PIPELINE SUMMARY">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Pipeline */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Pipeline</p>
          <p className="text-3xl font-bold text-blue-600">
            ${(totalPipeline / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {opportunityCount} opportunities
          </p>
        </div>

        {/* Weighted Forecast */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weighted Forecast</p>
          <p className="text-3xl font-bold text-green-600">
            ${(weightedForecast / 1000).toFixed(0)}K
          </p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">vs Target</span>
              <span className="font-semibold text-dark dark:text-white">
                {targetProgress.toFixed(0)}%
              </span>
            </div>
            <ProgressBar
              value={targetProgress}
              max={100}
              variant={targetProgress >= 100 ? "success" : targetProgress >= 80 ? "primary" : "warning"}
            />
          </div>
        </div>

        {/* Quarter Target */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quarter Target</p>
          <p className="text-3xl font-bold text-dark dark:text-white">
            ${(quarterTarget / 1000).toFixed(0)}K
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Coverage Ratio</span>
              <span className="font-semibold text-blue-600">{coverageRatio.toFixed(1)}x</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Win Rate</span>
              <span className="font-semibold text-green-600">{winRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Coverage Bar */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-dark dark:text-white">Pipeline Coverage</span>
          <span className="text-gray-600 dark:text-gray-400">
            ${totalPipeline.toLocaleString()} / ${quarterTarget.toLocaleString()}
          </span>
        </div>
        <ProgressBar
          value={pipelineCoverage}
          max={100}
          variant={pipelineCoverage >= 300 ? "success" : pipelineCoverage >= 200 ? "primary" : "warning"}
        />
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {pipelineCoverage >= 300
            ? "✅ Excellent pipeline coverage"
            : pipelineCoverage >= 200
            ? "✓ Good pipeline coverage"
            : "⚠️ Pipeline coverage below recommended 3x target"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Avg Deal Size</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
            ${(totalPipeline / opportunityCount / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">Expected Revenue</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            ${(weightedForecast / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3">
          <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Coverage</p>
          <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
            {coverageRatio.toFixed(1)}x
          </p>
        </div>
        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Win Rate</p>
          <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{winRate}%</p>
        </div>
      </div>
    </WidgetCard>
  );
}

