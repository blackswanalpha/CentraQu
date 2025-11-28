"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";

export default function TaskAnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Task Management &gt; Analytics
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Performance metrics and insights on task management
            </p>
          </div>
          <select className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-dark dark:text-white mb-6">
            TASK PERFORMANCE METRICS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                TOTAL TASKS
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                187
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Created
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                COMPLETED
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                142
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                (76%)
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ON-TIME COMPLETE
              </p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                128
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                (90%)
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                OVERDUE
              </p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">
                12
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                (6%)
              </p>
            </div>
          </div>
        </div>

        {/* Completion Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
            COMPLETION TREND
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
            <p className="text-gray-500 dark:text-gray-400">
              Chart visualization coming soon
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Month
              </p>
              <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                76%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                completion rate
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Previous Month
              </p>
              <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                82%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                completion rate
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target
              </p>
              <p className="text-2xl font-bold text-primary mt-1">85%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                completion rate
              </p>
            </div>
          </div>
        </div>

        {/* Tasks by Category & Completion Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              TASKS BY CATEGORY
            </h2>
            <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400">
                Pie chart coming soon
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Invoicing: <span className="font-semibold text-dark dark:text-white">45 (24%)</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Sales: <span className="font-semibold text-dark dark:text-white">38 (20%)</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Audit Scheduling: <span className="font-semibold text-dark dark:text-white">32 (17%)</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Compliance: <span className="font-semibold text-dark dark:text-white">28 (15%)</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                HR: <span className="font-semibold text-dark dark:text-white">22 (12%)</span>
              </p>
            </div>
          </div>

          {/* Average Completion Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              AVERAGE COMPLETION TIME
            </h2>
            <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400">
                Bar chart coming soon
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Invoicing: <span className="font-semibold text-dark dark:text-white">1.2 days</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Sales: <span className="font-semibold text-dark dark:text-white">3.5 days</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Audit: <span className="font-semibold text-dark dark:text-white">4.8 days</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Compliance: <span className="font-semibold text-dark dark:text-white">2.1 days</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Overall Average: <span className="font-semibold text-dark dark:text-white">3.5 days</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tasks by Assignee & Overdue Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks by Assignee */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              TASKS BY ASSIGNEE
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">You</span>
                <span className="font-semibold text-dark dark:text-white">45 assigned • 34 done</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Sarah M.</span>
                <span className="font-semibold text-dark dark:text-white">42 assigned • 38 done</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">James K.</span>
                <span className="font-semibold text-dark dark:text-white">38 assigned • 28 done</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Linda P.</span>
                <span className="font-semibold text-dark dark:text-white">35 assigned • 27 done</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Michael R.</span>
                <span className="font-semibold text-dark dark:text-white">27 assigned • 15 done</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              Top Performer: Sarah M. (90% completion)
            </p>
          </div>

          {/* Overdue Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
              OVERDUE TASK ANALYSIS
            </h2>
            <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400">
                Bar chart coming soon
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Invoicing: <span className="font-semibold text-dark dark:text-white">5 tasks</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Reporting: <span className="font-semibold text-dark dark:text-white">3 tasks</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Follow-ups: <span className="font-semibold text-dark dark:text-white">2 tasks</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Other: <span className="font-semibold text-dark dark:text-white">2 tasks</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              Root Cause: Capacity issues
            </p>
          </div>
        </div>

        {/* Productivity Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
            PRODUCTIVITY INSIGHTS
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🎯 High-Priority Tasks: <span className="font-semibold text-dark dark:text-white">78% completed on time (↑ 5%)</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ⏱️ Average Response Time: <span className="font-semibold text-dark dark:text-white">4.2 hours (target: 4 hours)</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📊 Task Load Distribution: <span className="font-semibold text-accent">Unbalanced (recommend rebalancing)</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🔄 Recurring Tasks: <span className="font-semibold text-dark dark:text-white">92% automated successfully</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📧 Reminder Effectiveness: <span className="font-semibold text-dark dark:text-white">89% response rate</span>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Recommendations:
            </p>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Redistribute tasks from Michael R. (completion rate 56%)</li>
              <li>• Create template for recurring invoice tasks (save 3hrs/week)</li>
              <li>• Increase reminder frequency for compliance tasks</li>
            </ul>
          </div>

          <div className="flex gap-2 mt-6">
            <Button variant="secondary">DOWNLOAD FULL REPORT</Button>
            <Button variant="secondary">SHARE WITH TEAM</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

