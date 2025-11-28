"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Badge } from "@/components/Dashboard/badge";
import { ProgressBar } from "@/components/Dashboard/progress-bar";
import Link from "next/link";

export default function FinancialPerformancePage() {
  const projects = [
    {
      name: "ABC Strategy",
      revenue: 85000,
      costs: 52000,
      labor: 48000,
      expenses: 4000,
      margin: 38.8,
      budgetUtil: 92,
      status: "profitable",
    },
    {
      name: "XYZ Digital",
      revenue: 72000,
      costs: 45000,
      labor: 41000,
      expenses: 4000,
      margin: 37.5,
      budgetUtil: 88,
      status: "profitable",
    },
    {
      name: "DEF Process",
      revenue: 58000,
      costs: 52000,
      labor: 48000,
      expenses: 4000,
      margin: 10.3,
      budgetUtil: 115,
      status: "low-margin",
    },
    {
      name: "GHI ERP Impl",
      revenue: 45000,
      costs: 28000,
      labor: 25000,
      expenses: 3000,
      margin: 37.8,
      budgetUtil: 78,
      status: "profitable",
    },
    {
      name: "JKL Risk Mgmt",
      revenue: 38000,
      costs: 22000,
      labor: 20000,
      expenses: 2000,
      margin: 42.1,
      budgetUtil: 71,
      status: "high-margin",
    },
  ];

  const costBreakdown = [
    { category: "Direct Labor", percentage: 68, amount: 195000 },
    { category: "Contractor Fees", percentage: 12, amount: 34000 },
    { category: "Travel/Expenses", percentage: 8, amount: 23000 },
    { category: "Software/Tools", percentage: 5, amount: 14000 },
    { category: "Overhead", percentage: 7, amount: 20000 },
  ];

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Financial Performance
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Comprehensive financial metrics and analysis
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <option>Q4 2025</option>
              <option>Q3 2025</option>
              <option>Q2 2025</option>
              <option>Q1 2025</option>
              <option>YTD</option>
            </select>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Financial Overview
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last sync: 5m ago
            </span>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">REVENUE RECOG.</div>
              <div className="text-2xl font-bold text-dark dark:text-white">$287,000</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">YTD</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">GROSS MARGIN</div>
              <div className="text-2xl font-bold text-dark dark:text-white">65.2%</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 2.1%</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">NET PROFIT</div>
              <div className="text-2xl font-bold text-dark dark:text-white">32.5%</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 1.8%</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">CASH COLLECTED</div>
              <div className="text-2xl font-bold text-dark dark:text-white">$245,000</div>
              <div className="text-sm text-red-600 dark:text-red-400 mt-1">↓ $42K</div>
            </div>
          </div>
        </div>

        {/* Revenue Waterfall Analysis */}
        <WidgetCard
          title="Revenue Waterfall Analysis"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed Breakdown
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Aging Report
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Collection Plan
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Total Contract Value
                  </span>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    $485,000
                  </span>
                </div>
                <ProgressBar value={100} variant="primary" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Revenue Recognized
                  </span>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    $287,000 (59%)
                  </span>
                </div>
                <ProgressBar value={59} variant="success" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Remaining to Recognize
                  </span>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    $198,000 (41%)
                  </span>
                </div>
                <ProgressBar value={41} variant="info" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">
                Accounts Receivable Breakdown:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current (0-30 days):</span>
                  <span className="text-dark dark:text-white">$42,000 (60%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">31-60 days:</span>
                  <span className="text-dark dark:text-white">$14,000 (20%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">61-90 days:</span>
                  <span className="text-dark dark:text-white">$8,000 (11%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">90+ days (overdue):</span>
                  <span className="text-red-600 dark:text-red-400">$6,000 (9%) ⚠</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Days Sales Outstanding (DSO): 28 days (Target: 30 days) ✓
                </p>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Revenue Charts */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="Revenue by Project Type"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Service Line Analysis
              </Link>
            }
          >
            <div className="space-y-3">
              {[
                { type: "Strategy", percentage: 35, amount: 170000 },
                { type: "Digital Trans", percentage: 28, amount: 136000 },
                { type: "Process Opt", percentage: 22, amount: 107000 },
                { type: "Change Mgmt", percentage: 10, amount: 49000 },
                { type: "Other", percentage: 5, amount: 23000 },
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.type}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.percentage}% (${item.amount.toLocaleString()})
                    </span>
                  </div>
                  <ProgressBar value={item.percentage} variant="primary" />
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Top Earner:</span>
                  <span className="text-dark dark:text-white">Strategy Consulting</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Growth Opportunity:</span>
                  <span className="text-dark dark:text-white">Digital Transformation</span>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Monthly Revenue Trend"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Trend Analysis
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recognized</div>
                  <div className="text-sm font-semibold text-dark dark:text-white">$47K</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Invoiced</div>
                  <div className="text-sm font-semibold text-dark dark:text-white">$52K</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Collected</div>
                  <div className="text-sm font-semibold text-dark dark:text-white">$45K</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">October:</span>
                  <span className="text-dark dark:text-white">$47K / $52K / $45K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">September:</span>
                  <span className="text-dark dark:text-white">$38K / $41K / $39K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">August:</span>
                  <span className="text-dark dark:text-white">$42K / $45K / $43K</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Collection Rate:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Trend:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Improving ↑</span>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Project Profitability Analysis */}
        <WidgetCard
          title="Project Profitability Analysis"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed P&L by Project
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Variance Analysis
              </button>
              <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
                Export Report
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-semibold text-dark dark:text-white">Project</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Revenue</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Costs</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Margin</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Budget Util</th>
                  <th className="text-left py-3 px-2 font-semibold text-dark dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={project.name}
                    className={index < projects.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}
                  >
                    <td className="py-4 px-2">
                      <div>
                        <div className="font-medium text-dark dark:text-white">{project.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Labor: ${project.labor.toLocaleString()} | Expenses: ${project.expenses.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">
                      ${project.revenue.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">
                      ${project.costs.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-2">
                      <span className={`font-medium ${
                        project.margin >= 35 ? "text-green-600" :
                        project.margin >= 25 ? "text-blue-600" :
                        "text-yellow-600"
                      }`}>
                        {project.margin}%
                      </span>
                    </td>
                    <td className="text-right py-4 px-2">
                      <span className={`font-medium ${
                        project.budgetUtil <= 100 ? "text-green-600" : "text-red-600"
                      }`}>
                        {project.budgetUtil}%
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <Badge
                        label={
                          project.status === "high-margin" ? "✓ High Margin" :
                          project.status === "profitable" ? "✓ Profitable" :
                          "⚠ Low Margin"
                        }
                        variant={
                          project.status === "high-margin" ? "success" :
                          project.status === "profitable" ? "primary" :
                          "warning"
                        }
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Portfolio Average Margin:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">33.3%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Target Margin:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">35%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Projects Meeting Target:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">2 of 5 (40%)</span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Cost Structure & Forecast */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="Cost Structure Breakdown"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Cost Optimization
              </Link>
            }
          >
            <div className="space-y-4">
              {costBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.percentage}% (${item.amount.toLocaleString()})
                    </span>
                  </div>
                  <ProgressBar value={item.percentage} variant="primary" />
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Costs:</span>
                  <span className="text-dark dark:text-white font-semibold">$286,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cost/Revenue:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">59% (Target: 60%) ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Good ✓</span>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Forecast vs Actual"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Adjust Forecast
              </Link>
            }
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Q4 2025:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Forecast:</span>
                    <span className="text-dark dark:text-white">$150K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Actual:</span>
                    <span className="text-dark dark:text-white">$142K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Variance:</span>
                    <span className="text-yellow-600 dark:text-yellow-400">-$8K (-5%)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">YTD:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Forecast:</span>
                    <span className="text-dark dark:text-white">$450K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Actual:</span>
                    <span className="text-dark dark:text-white">$485K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Variance:</span>
                    <span className="text-green-600 dark:text-green-400">+$35K (+8%) ✓</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Confidence Level: 87%
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Cash Flow & Zoho Integration */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="Cash Flow Projection (Next 90 Days)"
            action={
              <div className="flex gap-2">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Detailed Cash Flow
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Scenario Planning
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Download
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Cash Balance</div>
                <div className="text-3xl font-bold text-dark dark:text-white">$245,000</div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Expected Inflows:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Nov: $58,000 (3 invoices due)</li>
                  <li>• Dec: $72,000 (milestone payments)</li>
                  <li>• Jan: $45,000 (project completions)</li>
                  <li className="font-semibold text-dark dark:text-white">Total Expected: $175,000</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Expected Outflows:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Payroll: $105,000 (3 months)</li>
                  <li>• Contractors: $18,000</li>
                  <li>• Operating Expenses: $24,000</li>
                  <li>• Tax Payments: $15,000 (Dec)</li>
                  <li className="font-semibold text-dark dark:text-white">Total Outflows: $162,000</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Projected Cash Position (90 days):</span>
                    <span className="font-semibold text-green-700 dark:text-green-400">$258,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Minimum Cash Reserve Target:</span>
                    <span className="text-dark dark:text-white">$150,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Buffer:</span>
                    <span className="font-semibold text-green-700 dark:text-green-400">$108,000 (Healthy) ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </WidgetCard>

          <div className="space-y-6">
            <WidgetCard
              title="Zoho Books Integration Status"
              action={
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View in Zoho Books
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Sync Now
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Configure
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Last Sync: 5 minutes ago ✓
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Sync Status: Active
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-dark dark:text-white">1,247</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Records Synced</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Synced Data:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>✓ Invoices (142)</li>
                    <li>✓ Payments (128)</li>
                    <li>✓ Expenses (89)</li>
                    <li>✓ Time Entries (1,248)</li>
                    <li>✓ Projects (15)</li>
                  </ul>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Next Scheduled Sync: 15 min
                </div>
              </div>
            </WidgetCard>

            <WidgetCard title="Billing Efficiency">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Time to Invoice:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">3.2 days (Target: 5) ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Invoicing Accuracy:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">98.5% (2 corrections) ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Collection Effectiveness:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">94% within terms ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Revenue Leakage:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">$2,800 (0.6%) ✓</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  (unbilled time/expenses)
                </div>
                <button className="w-full mt-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Improve Process
                </button>
              </div>
            </WidgetCard>
          </div>
        </div>

        {/* Financial Insights */}
        <WidgetCard
          title="Financial Insights & Recommendations"
          action={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Generate CFO Report
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Schedule Finance Review
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Export
              </button>
            </div>
          }
        >
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Strong Cash Position: $245K cash, healthy buffer
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Consider strategic investments or hiring
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-2xl">⚠</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Low Margin Alert: DEF Process project at 10.3% margin
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Implement change order, manage scope strictly
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Revenue Ahead of Forecast: +8% YTD (Excellent)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Maintain momentum, increase forecast confidence
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  DSO Performance: 28 days vs 30 day target
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Continue current collection practices
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Service Mix Opportunity: Digital transformation growing
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Invest in digital capabilities and marketing
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  $6K Overdue Receivables: PQR Corp (45 days)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Action: Escalate collection, consider legal steps
                </p>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

