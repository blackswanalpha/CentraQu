"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, useEffect } from "react";
import { auditService, type CalendarAudit } from "@/services/audit.service";

export default function AuditCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("month");
  const [audits, setAudits] = useState<CalendarAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Previous month's days
  const prevMonthDays = getDaysInMonth(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
  );
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        prevMonthDays - i
      ),
    });
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
    });
  }

  // Next month's days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i
      ),
    });
  }

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Fetch audits for the current month
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get first and last day of current month
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const response = await auditService.getCalendarAudits({
          start_date: firstDay.toISOString().split('T')[0],
          end_date: lastDay.toISOString().split('T')[0],
        });

        setAudits(response.data || []);
      } catch (err) {
        console.error('Error fetching calendar audits:', err);
        setError('Failed to load calendar data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, [currentDate]);

  // Group audits by date
  const auditsByDate: Record<string, CalendarAudit[]> = {};
  audits.forEach((audit) => {
    const date = new Date(audit.start_date);
    const day = date.getDate().toString();
    if (!auditsByDate[day]) {
      auditsByDate[day] = [];
    }
    auditsByDate[day].push(audit);
  });

  const getAuditColor = (type: string) => {
    const colors: Record<string, string> = {
      "INITIAL": "bg-blue-500",
      "SURVEILLANCE": "bg-yellow-500",
      "RECERTIFICATION": "bg-orange-500",
      "SPECIAL": "bg-purple-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Audit Calendar
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Visual schedule of all audits
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            + Schedule Audit
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading calendar...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Calendar Controls */}
        {!loading && !error && (
          <WidgetCard title="Calendar">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="px-3 py-1 border border-gray-300 rounded dark:border-gray-600"
              >
                ◄
              </button>
              <span className="text-lg font-semibold min-w-40 text-center">
                {monthName}
              </span>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="px-3 py-1 border border-gray-300 rounded dark:border-gray-600"
              >
                ►
              </button>
            </div>
            <div className="flex gap-2">
              {["Month", "Week", "Day", "List"].map((mode) => (
                <button
                  key={mode}
                  onClick={() =>
                    setViewMode(mode.toLowerCase() as typeof viewMode)
                  }
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === mode.toLowerCase()
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          {viewMode === "month" && (
            <div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-sm py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((dayObj, idx) => (
                  <div
                    key={idx}
                    className={`min-h-24 p-2 border rounded ${
                      dayObj.isCurrentMonth
                        ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {dayObj.day}
                    </div>
                    <div className="space-y-1">
                      {dayObj.isCurrentMonth && auditsByDate[dayObj.day.toString()]?.map((audit) => (
                        <div
                          key={audit.id}
                          className={`${getAuditColor(
                            audit.type
                          )} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80`}
                          title={`${audit.client} - ${audit.standard} - ${audit.auditor}`}
                        >
                          <div className="font-semibold truncate">{audit.client}</div>
                          <div className="truncate">{audit.standard}</div>
                          <div className="truncate">{audit.auditor}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode !== "month" && (
            <div className="text-center py-8 text-gray-500">
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view coming
              soon
            </div>
          )}
          </WidgetCard>
        )}

        {/* Filters and Legend */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <WidgetCard title="Filters">
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Auditor: All</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Cert Type: All</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Status: All</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>Client: All</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Show Travel Days</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Show Prep Time</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">Show Only My Audits</span>
              </label>
              <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                Apply Filters
              </button>
            </div>
          </WidgetCard>

          <WidgetCard title="Legend">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Stage 1 Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Stage 2 Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Surveillance Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm">Re-certification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Gap Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Follow-up</span>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Auditor Availability">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sarah Mitchell</span>
                <span className="text-xs text-red-600">🔴 95% Booked</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">James Kennedy</span>
                <span className="text-xs text-green-600">🟢 78% Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Linda Peterson</span>
                <span className="text-xs text-yellow-600">🟡 82% Limited</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Michael Roberts</span>
                <span className="text-xs text-green-600">🟢 45% Available</span>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
                View Detailed Availability
              </button>
            </div>
          </WidgetCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

