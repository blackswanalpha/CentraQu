"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import { KPICard } from "@/components/Dashboard/kpi-card";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Badge } from "@/components/Dashboard/badge";
import { ProgressBar } from "@/components/Dashboard/progress-bar";
import Link from "next/link";

export default function BusinessDevelopmentPage() {
  const opportunities = [
    {
      service: "Strategy Consulting",
      count: 8,
      value: 285000,
      weighted: 171000,
      avgDeal: 35625,
      winRate: 72,
    },
    {
      service: "Digital Transformation",
      count: 6,
      value: 240000,
      weighted: 144000,
      avgDeal: 40000,
      winRate: 65,
    },
    {
      service: "Process Optimization",
      count: 5,
      value: 175000,
      weighted: 105000,
      avgDeal: 35000,
      winRate: 68,
    },
    {
      service: "Change Management",
      count: 4,
      value: 85000,
      weighted: 51000,
      avgDeal: 21250,
      winRate: 70,
    },
    {
      service: "Risk Management",
      count: 2,
      value: 40000,
      weighted: 14000,
      avgDeal: 20000,
      winRate: 55,
    },
  ];

  const topOpportunities = [
    {
      name: "ABC Corp - Digital Strategy",
      value: 95000,
      probability: 85,
      stage: "Proposal",
      owner: "Sarah M.",
      closeDate: "Dec 15",
      status: "hot",
      nextAction: "Final presentation scheduled",
    },
    {
      name: "XYZ Ltd - ERP Implementation",
      value: 120000,
      probability: 70,
      stage: "Negotiation",
      owner: "James K.",
      closeDate: "Jan 10",
      status: "advancing",
      nextAction: "Contract review in progress",
    },
    {
      name: "DEF Inc - Process Reengineering",
      value: 75000,
      probability: 60,
      stage: "Discovery",
      owner: "Linda P.",
      closeDate: "Jan 30",
      status: "advancing",
      nextAction: "Scope workshop next week",
    },
    {
      name: "GHI Co - Change Management",
      value: 55000,
      probability: 75,
      stage: "Proposal",
      owner: "Michael R.",
      closeDate: "Dec 20",
      status: "hot",
      nextAction: "Awaiting decision",
    },
    {
      name: "JKL Ent - Risk Assessment",
      value: 40000,
      probability: 30,
      stage: "Qualification",
      owner: "Emma T.",
      closeDate: "Feb 15",
      status: "stalled",
      nextAction: "Follow-up needed",
    },
  ];

  const salesTeam = [
    { name: "Sarah Mitchell", pipeline: 285000, deals: 8, winRate: 72, activity: 142 },
    { name: "James Kennedy", pipeline: 240000, deals: 6, winRate: 65, activity: 128 },
    { name: "Linda Peterson", pipeline: 175000, deals: 5, winRate: 68, activity: 115 },
    { name: "Michael Roberts", pipeline: 85000, deals: 4, winRate: 70, activity: 98 },
    { name: "Emma Thompson", pipeline: 40000, deals: 2, winRate: 55, activity: 67 },
  ];

  return (
    <ConsultingDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Business Development Pipeline
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Track sales pipeline and business development activities
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <option>All Opportunities</option>
              <option>My Opportunities</option>
              <option>Team Opportunities</option>
            </select>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="PIPELINE VALUE"
            value="$825K"
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="WEIGHTED FORECAST"
            value="$485K"
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="WIN RATE"
            value="68%"
            trend={{ value: 3, isPositive: true }}
          />
          <KPICard
            title="AVG DEAL SIZE"
            value="$41.3K"
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Sales Funnel */}
        <WidgetCard
          title="Sales Funnel"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Conversion Analysis
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Funnel Optimization
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Export
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Lead (42 leads)
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    $1,250,000 (100%)
                  </span>
                </div>
                <ProgressBar value={100} variant="primary" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Qualification (28 opps)
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    $950,000 (76%)
                  </span>
                </div>
                <ProgressBar value={76} variant="primary" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Discovery (18 opps)
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    $825,000 (66%)
                  </span>
                </div>
                <ProgressBar value={66} variant="primary" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Proposal (12 opps)
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    $580,000 (46%)
                  </span>
                </div>
                <ProgressBar value={46} variant="success" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Negotiation (7 opps)
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    $385,000 (31%)
                  </span>
                </div>
                <ProgressBar value={31} variant="success" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-white">
                    Closed Won (YTD)
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    $485,000 (68% win rate)
                  </span>
                </div>
                <ProgressBar value={68} variant="success" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Conversion Rate:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">68%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Avg Sales Cycle:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">42 days</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Velocity:</span>
                <span className="ml-2 font-semibold text-green-600">Improving ↑</span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Opportunities by Service Line */}
        <WidgetCard
          title="Opportunities by Service Line"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Service Line Strategy
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Market Analysis
              </button>
              <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
                Export
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-semibold text-dark dark:text-white">Service Line</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Count</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Total Value</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Weighted</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Avg Deal</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp, index) => (
                  <tr
                    key={opp.service}
                    className={index < opportunities.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}
                  >
                    <td className="py-4 px-2 font-medium text-dark dark:text-white">{opp.service}</td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">{opp.count}</td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">
                      ${opp.value.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">
                      ${opp.weighted.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">
                      ${opp.avgDeal.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-2">
                      <span className={`font-medium ${
                        opp.winRate >= 70 ? "text-green-600" :
                        opp.winRate >= 60 ? "text-blue-600" :
                        "text-yellow-600"
                      }`}>
                        {opp.winRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Opportunities:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">25</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Pipeline:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">$825,000</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Weighted Forecast:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">$485,000</span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Forecast by Quarter & Pipeline Health */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="Forecast by Quarter"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Adjust Forecast
              </Link>
            }
          >
            <div className="space-y-4">
              {[
                { quarter: "Q4 2025", forecast: 142000, confidence: 87, range: "120K-165K" },
                { quarter: "Q1 2026", forecast: 185000, confidence: 72, range: "155K-215K" },
                { quarter: "Q2 2026", forecast: 158000, confidence: 58, range: "125K-190K" },
              ].map((q) => (
                <div key={q.quarter} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-dark dark:text-white">{q.quarter}</h4>
                    <Badge
                      label={`${q.confidence}% confidence`}
                      variant={q.confidence >= 80 ? "success" : q.confidence >= 60 ? "primary" : "warning"}
                      size="sm"
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Weighted Forecast:</span>
                      <span className="text-dark dark:text-white font-semibold">
                        ${q.forecast.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Confidence Range:</span>
                      <span className="text-dark dark:text-white">${q.range}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={q.confidence} variant="primary" showPercentage={false} />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Forecast (Next 3Q):</span>
                  <span className="text-dark dark:text-white font-semibold">$485,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Confidence:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">72%</span>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Pipeline Health"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Health Check
              </Link>
            }
          >
            <div className="space-y-6">
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-5xl font-bold text-green-600 dark:text-green-400">82/100</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Pipeline Health Score</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">Healthy ✓</div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Health Indicators:</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-dark dark:text-white">Pipeline Coverage</span>
                      <span className="text-sm text-green-600 dark:text-green-400">3.2x (Target: 3x) ✓</span>
                    </div>
                    <ProgressBar value={107} max={100} variant="success" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-dark dark:text-white">Stage Distribution</span>
                      <span className="text-sm text-green-600 dark:text-green-400">Balanced ✓</span>
                    </div>
                    <ProgressBar value={85} variant="success" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-dark dark:text-white">Deal Velocity</span>
                      <span className="text-sm text-green-600 dark:text-green-400">42 days (Good) ✓</span>
                    </div>
                    <ProgressBar value={90} variant="success" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-dark dark:text-white">Win Rate</span>
                      <span className="text-sm text-green-600 dark:text-green-400">68% (Target: 65%) ✓</span>
                    </div>
                    <ProgressBar value={105} max={100} variant="success" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-dark dark:text-white">Activity Level</span>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">Moderate ⚠</span>
                    </div>
                    <ProgressBar value={72} variant="warning" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  ⚠ Recommendation: Increase prospecting activity to maintain pipeline
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Top Opportunities */}
        <WidgetCard
          title="Top Opportunities"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                All Opportunities (25)
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Stalled Deals (3)
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Add Opportunity
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {topOpportunities.map((opp, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  opp.status === "hot" ? "border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-700" :
                  opp.status === "advancing" ? "border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-700" :
                  "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-700"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-dark dark:text-white">{opp.name}</h4>
                      <Badge
                        label={
                          opp.status === "hot" ? "🔥 Hot" :
                          opp.status === "advancing" ? "✓ Advancing" :
                          "⏸ Stalled"
                        }
                        variant={
                          opp.status === "hot" ? "error" :
                          opp.status === "advancing" ? "success" :
                          "warning"
                        }
                        size="sm"
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Owner: {opp.owner} | Close: {opp.closeDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-dark dark:text-white">
                      ${opp.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {opp.probability}% prob
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Stage: </span>
                    <span className="text-dark dark:text-white font-medium">{opp.stage}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Weighted: </span>
                    <span className="text-dark dark:text-white font-medium">
                      ${((opp.value * opp.probability) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Probability</div>
                  <ProgressBar
                    value={opp.probability}
                    variant={opp.probability >= 70 ? "success" : opp.probability >= 50 ? "primary" : "warning"}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Next: {opp.nextAction}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded hover:bg-white dark:hover:bg-gray-800">
                      View
                    </button>
                    <button className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded hover:bg-white dark:hover:bg-gray-800">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Win/Loss Analysis & Lead Sources */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WidgetCard
            title="Win/Loss Analysis"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detailed Analysis
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">17</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Won</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lost</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-dark dark:text-white">68%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Win Rate</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Top Win Reasons:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✓ Expertise/reputation: 42%</li>
                  <li>✓ Relationship/trust: 28%</li>
                  <li>✓ Competitive pricing: 18%</li>
                  <li>✓ Unique approach: 12%</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Top Loss Reasons:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✗ Price too high: 38%</li>
                  <li>✗ Lost to competitor: 25%</li>
                  <li>✗ Timing/budget: 22%</li>
                  <li>✗ No decision made: 15%</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Win Value:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">$45,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Loss Value:</span>
                  <span className="text-red-600 dark:text-red-400">$38,500</span>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Lead Source Performance"
            action={
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Marketing ROI
              </Link>
            }
          >
            <div className="space-y-4">
              {[
                { source: "Referrals", leads: 18, opps: 12, won: 9, winRate: 75, value: 285000 },
                { source: "Website", leads: 24, opps: 8, won: 4, winRate: 50, value: 142000 },
                { source: "Events", leads: 12, opps: 6, won: 3, winRate: 50, value: 98000 },
                { source: "LinkedIn", leads: 15, opps: 5, won: 2, winRate: 40, value: 65000 },
                { source: "Cold Outreach", leads: 8, opps: 2, won: 1, winRate: 50, value: 35000 },
              ].map((source) => (
                <div key={source.source} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-dark dark:text-white">{source.source}</h4>
                    <Badge
                      label={`${source.winRate}% win rate`}
                      variant={source.winRate >= 70 ? "success" : source.winRate >= 50 ? "primary" : "warning"}
                      size="sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Leads</div>
                      <div className="text-dark dark:text-white font-medium">{source.leads}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Opps</div>
                      <div className="text-dark dark:text-white font-medium">{source.opps}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Won</div>
                      <div className="text-green-600 dark:text-green-400 font-medium">{source.won}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Revenue: </span>
                    <span className="text-dark dark:text-white font-semibold">
                      ${source.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Best Performer:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Referrals (75% win rate)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Highest Volume:</span>
                  <span className="text-dark dark:text-white">Website (24 leads)</span>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Sales Team Performance */}
        <WidgetCard
          title="Sales Team Performance"
          action={
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Individual Dashboards
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Coaching Plans
              </button>
              <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
                Export
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-semibold text-dark dark:text-white">Sales Rep</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Pipeline</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Deals</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Win Rate</th>
                  <th className="text-right py-3 px-2 font-semibold text-dark dark:text-white">Activity</th>
                </tr>
              </thead>
              <tbody>
                {salesTeam.map((rep, index) => (
                  <tr
                    key={rep.name}
                    className={index < salesTeam.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}
                  >
                    <td className="py-4 px-2 font-medium text-dark dark:text-white">{rep.name}</td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">
                      ${rep.pipeline.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-2 text-dark dark:text-white">{rep.deals}</td>
                    <td className="text-right py-4 px-2">
                      <span className={`font-medium ${
                        rep.winRate >= 70 ? "text-green-600" :
                        rep.winRate >= 60 ? "text-blue-600" :
                        "text-yellow-600"
                      }`}>
                        {rep.winRate}%
                      </span>
                    </td>
                    <td className="text-right py-4 px-2">
                      <span className={`font-medium ${
                        rep.activity >= 120 ? "text-green-600" :
                        rep.activity >= 90 ? "text-blue-600" :
                        "text-yellow-600"
                      }`}>
                        {rep.activity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Team Pipeline:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">$825,000</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Avg Win Rate:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">68%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Activity:</span>
                <span className="ml-2 font-semibold text-dark dark:text-white">550 this month</span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Activities & Productivity */}
        <WidgetCard
          title="Activities & Productivity"
          action={
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Activity Report
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                Set Goals
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Export
              </button>
            </div>
          }
        >
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">This Month:</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Calls Made:</span>
                  <span className="text-sm font-semibold text-dark dark:text-white">247</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Meetings Held:</span>
                  <span className="text-sm font-semibold text-dark dark:text-white">68</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Proposals Sent:</span>
                  <span className="text-sm font-semibold text-dark dark:text-white">12</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Follow-ups:</span>
                  <span className="text-sm font-semibold text-dark dark:text-white">142</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-dark dark:text-white mb-3">Productivity Metrics:</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-dark dark:text-white">Call-to-Meeting Rate</span>
                    <span className="text-sm text-green-600 dark:text-green-400">28% (Target: 25%) ✓</span>
                  </div>
                  <ProgressBar value={112} max={100} variant="success" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-dark dark:text-white">Meeting-to-Proposal Rate</span>
                    <span className="text-sm text-green-600 dark:text-green-400">18% (Target: 15%) ✓</span>
                  </div>
                  <ProgressBar value={120} max={100} variant="success" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-dark dark:text-white">Proposal-to-Close Rate</span>
                    <span className="text-sm text-blue-600 dark:text-blue-400">58% (Target: 60%)</span>
                  </div>
                  <ProgressBar value={97} max={100} variant="primary" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-dark dark:text-white">Response Time</span>
                    <span className="text-sm text-green-600 dark:text-green-400">2.4h (Target: 4h) ✓</span>
                  </div>
                  <ProgressBar value={167} max={100} variant="success" />
                </div>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>
    </ConsultingDashboardLayout>
  );
}

