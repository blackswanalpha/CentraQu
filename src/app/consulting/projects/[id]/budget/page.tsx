"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CostItem {
  category: string;
  planned: number;
  actual: number;
  forecast: number;
  variance: number;
}

const mockCostBreakdown: CostItem[] = [
  { category: "Labor - Senior Consultant", planned: 45000, actual: 38500, forecast: 42000, variance: -3000 },
  { category: "Labor - Mid-level Consultant", planned: 25000, actual: 22100, forecast: 24500, variance: -500 },
  { category: "Travel & Accommodation", planned: 8000, actual: 6200, forecast: 7500, variance: -500 },
  { category: "Software & Tools", planned: 4000, actual: 3800, forecast: 4000, variance: 0 },
  { category: "Training & Materials", planned: 3000, actual: 2800, forecast: 3000, variance: 0 },
];

const budgetMetrics = {
  totalBudget: 85000,
  spent: 66300,
  remaining: 18700,
  forecast: 81500,
  variance: 3500,
  cpi: 1.02,
  spi: 1.03,
  eac: 81500,
  etc: 15200,
};

export default function BudgetPage() {
  const params = useParams();
  const id = params.id as string;
  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/consulting/projects/${id}`} className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
              ← Back to Project
            </Link>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              PROJECT BUDGET TRACKING
            </h1>
          </div>
        </div>

        {/* Budget Summary */}
        <WidgetCard title="BUDGET SUMMARY">
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Budget</p>
                <p className="text-3xl font-bold text-dark dark:text-white">${(budgetMetrics.totalBudget / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Spent to Date</p>
                <p className="text-3xl font-bold text-blue-600">${(budgetMetrics.spent / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">({((budgetMetrics.spent / budgetMetrics.totalBudget) * 100).toFixed(0)}%)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Remaining</p>
                <p className="text-3xl font-bold text-green-600">${(budgetMetrics.remaining / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">({((budgetMetrics.remaining / budgetMetrics.totalBudget) * 100).toFixed(0)}%)</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Utilization</span>
                <span className="text-sm font-bold text-dark dark:text-white">{((budgetMetrics.spent / budgetMetrics.totalBudget) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(budgetMetrics.spent / budgetMetrics.totalBudget) * 100}%` }} />
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Cost Breakdown */}
        <WidgetCard title="COST BREAKDOWN BY CATEGORY">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Planned</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Forecast</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Variance</th>
                </tr>
              </thead>
              <tbody>
                {mockCostBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.category}</td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">${(item.planned / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">${(item.actual / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">${(item.forecast / 1000).toFixed(0)}K</td>
                    <td className={`text-right py-3 px-4 font-medium ${item.variance < 0 ? "text-green-600" : "text-red-600"}`}>
                      ${(item.variance / 1000).toFixed(0)}K
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="py-3 px-4 font-medium text-dark dark:text-white">TOTAL</td>
                  <td className="text-right py-3 px-4 font-medium text-dark dark:text-white">${(mockCostBreakdown.reduce((sum, item) => sum + item.planned, 0) / 1000).toFixed(0)}K</td>
                  <td className="text-right py-3 px-4 font-medium text-dark dark:text-white">${(mockCostBreakdown.reduce((sum, item) => sum + item.actual, 0) / 1000).toFixed(0)}K</td>
                  <td className="text-right py-3 px-4 font-medium text-dark dark:text-white">${(mockCostBreakdown.reduce((sum, item) => sum + item.forecast, 0) / 1000).toFixed(0)}K</td>
                  <td className="text-right py-3 px-4 font-medium text-green-600">${(mockCostBreakdown.reduce((sum, item) => sum + item.variance, 0) / 1000).toFixed(0)}K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </WidgetCard>

        {/* Earned Value Analysis */}
        <WidgetCard title="EARNED VALUE ANALYSIS">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Cost Performance Index (CPI)</p>
              <p className="text-2xl font-bold text-green-600">{budgetMetrics.cpi.toFixed(2)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Earned Value / Actual Cost</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Schedule Performance Index (SPI)</p>
              <p className="text-2xl font-bold text-green-600">{budgetMetrics.spi.toFixed(2)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Earned Value / Planned Value</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Estimate at Completion (EAC)</p>
              <p className="text-2xl font-bold text-blue-600">${(budgetMetrics.eac / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Projected final cost</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Estimate to Complete (ETC)</p>
              <p className="text-2xl font-bold text-blue-600">${(budgetMetrics.etc / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Remaining work cost</p>
            </div>
          </div>
        </WidgetCard>

        {/* Burn Rate & Projections */}
        <WidgetCard title="BURN RATE & PROJECTIONS">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Monthly Burn Rate</p>
              <p className="text-2xl font-bold text-dark dark:text-white">$11,050/month</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Average spending per month</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Projected Completion</p>
              <p className="text-2xl font-bold text-green-600">Oct 31, 2025</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">On schedule with $3,500 under budget</p>
            </div>
          </div>
        </WidgetCard>

        {/* Invoice Status */}
        <WidgetCard title="INVOICE STATUS">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">Invoices Issued</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">5 of 6 invoices</p>
              </div>
              <p className="text-lg font-bold text-blue-600">$66,300</p>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">Payments Received</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">4 of 5 invoices</p>
              </div>
              <p className="text-lg font-bold text-green-600">$52,800</p>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">Outstanding</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Awaiting payment</p>
              </div>
              <p className="text-lg font-bold text-yellow-600">$13,500</p>
            </div>
          </div>
        </WidgetCard>

        {/* Budget Alerts */}
        <WidgetCard title="BUDGET ALERTS">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">✓ On Budget</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Project is tracking $3,500 under budget</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">ℹ Final Invoice Due</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Last invoice ($18,700) to be issued upon project completion</p>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

