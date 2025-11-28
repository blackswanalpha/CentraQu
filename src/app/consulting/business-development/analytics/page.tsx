"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Badge } from "@/components/Dashboard/badge";
import { ProgressBar } from "@/components/Dashboard/progress-bar";
import Link from "next/link";

export default function SalesAnalyticsPage() {
  const kpis = {
    totalPipeline: 825000,
    weightedForecast: 485000,
    winRate: 68,
    avgDealSize: 41250,
    salesCycle: 42,
    conversionRate: 35,
  };

  const quarterlyPerformance = [
    { quarter: "Q1 2025", target: 150000, actual: 165000, deals: 4, winRate: 72 },
    { quarter: "Q2 2025", target: 150000, actual: 142000, deals: 3, winRate: 65 },
    { quarter: "Q3 2025", target: 150000, actual: 158000, deals: 4, winRate: 70 },
    { quarter: "Q4 2025", target: 150000, forecast: 142000, deals: 2, winRate: 68 },
  ];

  const servicePerformance = [
    { service: "Strategy Consulting", opportunities: 8, value: 285000, winRate: 72, avgDeal: 35625 },
    { service: "Digital Transformation", opportunities: 6, value: 240000, winRate: 65, avgDeal: 40000 },
    { service: "Process Optimization", opportunities: 5, value: 175000, winRate: 68, avgDeal: 35000 },
    { service: "Change Management", opportunities: 4, value: 85000, winRate: 70, avgDeal: 21250 },
    { service: "Risk Management", opportunities: 2, value: 40000, winRate: 55, avgDeal: 20000 },
  ];

  const salesTeamPerformance = [
    { name: "James Kennedy", opportunities: 8, value: 285000, won: 6, winRate: 75, avgCycle: 38 },
    { name: "Sarah Mitchell", opportunities: 6, value: 240000, won: 4, winRate: 67, avgCycle: 45 },
    { name: "Linda Peterson", opportunities: 5, value: 175000, won: 3, winRate: 60, avgCycle: 42 },
    { name: "Michael Roberts", opportunities: 4, value: 85000, won: 3, winRate: 75, avgCycle: 35 },
  ];

  const leadSources = [
    { source: "Referrals", leads: 18, opportunities: 12, won: 9, winRate: 75, value: 285000 },
    { source: "Website", leads: 24, opportunities: 8, won: 4, winRate: 50, value: 142000 },
    { source: "Events", leads: 12, opportunities: 6, won: 3, winRate: 50, value: 98000 },
    { source: "LinkedIn", leads: 15, opportunities: 5, won: 2, winRate: 40, value: 65000 },
    { source: "Cold Outreach", leads: 8, opportunities: 2, won: 1, winRate: 50, value: 35000 },
  ];

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Sales Analytics
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Comprehensive business development performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <option>Last 12 Months</option>
              <option>This Year</option>
              <option>Last Quarter</option>
              <option>Custom Range</option>
            </select>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Total Pipeline"
            value={`$${kpis.totalPipeline.toLocaleString()}`}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Weighted Forecast"
            value={`$${kpis.weightedForecast.toLocaleString()}`}
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Win Rate"
            value={`${kpis.winRate}%`}
            trend={{ value: 3, isPositive: true }}
          />
          <KPICard
            title="Avg Deal Size"
            value={`$${kpis.avgDealSize.toLocaleString()}`}
            trend={{ value: 5, isPositive: true }}
          />
          <KPICard
            title="Sales Cycle"
            value={`${kpis.salesCycle} days`}
            trend={{ value: 4, isPositive: true }}
          />
          <KPICard
            title="Conversion Rate"
            value={`${kpis.conversionRate}%`}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Quarterly Performance */}
        <WidgetCard
          title="Quarterly Performance"
          action={
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Quarter</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Target</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actual/Forecast</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Deals</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Performance</th>
                </tr>
              </thead>
              <tbody>
                {quarterlyPerformance.map((q) => {
                  const actual = q.actual || q.forecast || 0;
                  const performance = (actual / q.target) * 100;
                  return (
                    <tr key={q.quarter} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-sm font-medium text-dark dark:text-white">{q.quarter}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        ${q.target.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-dark dark:text-white">
                        ${actual.toLocaleString()}
                        {q.forecast && <span className="text-xs text-gray-500 ml-1">(forecast)</span>}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{q.deals}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{q.winRate}%</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={performance} max={100} variant={performance >= 100 ? "success" : "primary"} />
                          <span className={`text-sm font-medium ${performance >= 100 ? "text-green-600" : "text-blue-600"}`}>
                            {performance.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </WidgetCard>

        {/* Service Line Performance */}
        <WidgetCard
          title="Service Line Performance"
          action={
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Detailed Analysis
            </Link>
          }
        >
          <div className="space-y-4">
            {servicePerformance.map((service) => (
              <div key={service.service} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-dark dark:text-white">{service.service}</h4>
                  <Badge
                    label={`${service.winRate}% win rate`}
                    variant={service.winRate >= 70 ? "success" : service.winRate >= 60 ? "primary" : "warning"}
                    size="sm"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Opportunities</p>
                    <p className="text-lg font-semibold text-dark dark:text-white">{service.opportunities}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Value</p>
                    <p className="text-lg font-semibold text-dark dark:text-white">
                      ${service.value.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Avg Deal Size</p>
                    <p className="text-lg font-semibold text-dark dark:text-white">
                      ${service.avgDeal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Win Rate</p>
                    <p className="text-lg font-semibold text-dark dark:text-white">{service.winRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Sales Team Performance & Lead Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Team Performance */}
          <WidgetCard
            title="Sales Team Performance"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Team Details
              </Link>
            }
          >
            <div className="space-y-3">
              {salesTeamPerformance.map((person) => (
                <div key={person.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-dark dark:text-white">{person.name}</h5>
                    <Badge
                      label={`${person.winRate}% win rate`}
                      variant={person.winRate >= 70 ? "success" : "primary"}
                      size="sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Pipeline</p>
                      <p className="font-semibold text-dark dark:text-white">
                        ${(person.value / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Deals Won</p>
                      <p className="font-semibold text-dark dark:text-white">
                        {person.won}/{person.opportunities}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Avg Cycle</p>
                      <p className="font-semibold text-dark dark:text-white">{person.avgCycle}d</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>

          {/* Lead Sources */}
          <WidgetCard
            title="Lead Source Performance"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Source Analysis
              </Link>
            }
          >
            <div className="space-y-3">
              {leadSources.map((source) => (
                <div key={source.source} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-dark dark:text-white">{source.source}</h5>
                    <Badge
                      label={`${source.winRate}% win rate`}
                      variant={source.winRate >= 70 ? "success" : source.winRate >= 50 ? "primary" : "warning"}
                      size="sm"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Leads</p>
                      <p className="font-semibold text-dark dark:text-white">{source.leads}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Opps</p>
                      <p className="font-semibold text-dark dark:text-white">{source.opportunities}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Won</p>
                      <p className="font-semibold text-dark dark:text-white">{source.won}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Value</p>
                      <p className="font-semibold text-dark dark:text-white">
                        ${(source.value / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                      <span className="text-dark dark:text-white">
                        {((source.opportunities / source.leads) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar
                      value={(source.opportunities / source.leads) * 100}
                      max={100}
                      variant="primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Key Insights */}
        <WidgetCard title="Key Insights & Recommendations">
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                    Strong Win Rate Performance
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your 68% win rate is significantly above the industry average of 55%. Continue focusing on
                    qualified opportunities and maintain your consultative selling approach.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                    Optimize Referral Channel
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Referrals show the highest win rate (75%) and value. Consider implementing a formal referral
                    program to increase volume from this high-performing channel.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠</span>
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    Q4 Target at Risk
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Q4 forecast ($142K) is below target ($150K). Focus on accelerating 2 high-probability deals
                    currently in negotiation stage to close the gap.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                    Sales Cycle Improvement
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Average sales cycle has decreased from 46 to 42 days. This 9% improvement is driving better
                    cash flow and allowing the team to handle more opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

