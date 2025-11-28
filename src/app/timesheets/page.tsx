"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { billingService, TimeSheetEntry } from "@/services/billing.service";
import Link from "next/link";

export default function TimeSheetsPage() {
  const [timesheets, setTimesheets] = useState<TimeSheetEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [approvedOnly, setApprovedOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Selection for bulk operations
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Fetch timesheet data from API
  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set default date range to current month if not set
        const now = new Date();
        const defaultDateFrom = dateFrom || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const defaultDateTo = dateTo || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const response = await billingService.getTimeSheets({
          date_from: defaultDateFrom,
          date_to: defaultDateTo,
          approved: approvedOnly || undefined,
          ordering: '-date',
        });

        setTimesheets(response.results);
      } catch (err) {
        console.error('Error fetching timesheet data:', err);
        setError('Failed to load timesheet data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch
    const timeoutId = setTimeout(() => {
      fetchTimesheetData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dateFrom, dateTo, selectedEmployee, selectedStatus, approvedOnly]);

  // Filter data based on search and selections
  const filteredData = useMemo(() => {
    return timesheets.filter(timesheet => {
      const matchesSearch = searchTerm === "" || 
        timesheet.certificate_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timesheet.work_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timesheet.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timesheet.project_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timesheet.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEmployee = selectedEmployee === "all" || timesheet.employee_name === selectedEmployee;
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "billable" && timesheet.billable_status === "BILLABLE") ||
        (selectedStatus === "non_billable" && timesheet.billable_status === "NON_BILLABLE") ||
        (selectedStatus === "billed" && (timesheet.billed_status === "BILLED" || timesheet.billed_status === "INVOICED"));
      
      return matchesSearch && matchesEmployee && matchesStatus;
    });
  }, [timesheets, searchTerm, selectedEmployee, selectedStatus]);

  // Get unique values for dropdowns
  const uniqueEmployees = useMemo(() => {
    return Array.from(new Set(timesheets.map(item => item.employee_name).filter(Boolean)));
  }, [timesheets]);

  const handleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredData.map(item => item.id)));
    }
  };

  const handleSelectItem = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) return;
    
    try {
      const response = await billingService.approveTimeSheets(Array.from(selectedItems));
      if (response.success) {
        // Refresh data
        setTimesheets(prev => prev.map(item => 
          selectedItems.has(item.id) ? { ...item, approved: true } : item
        ));
        setSelectedItems(new Set());
      }
    } catch (err) {
      console.error('Error approving timesheets:', err);
    }
  };

  const getStatusColor = (billableStatus: string, billedStatus: string) => {
    if (billedStatus === "BILLED" || billedStatus === "INVOICED" || billedStatus === "PAID") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    } else if (billableStatus === "BILLABLE") {
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    } else {
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTaskTypeIcon = (taskName: string) => {
    switch (taskName) {
      case '1ST_SURVEILLANCE': return "🔍";
      case '2ND_SURVEILLANCE': return "🔍";
      case 'RE_CERTIFICATION': return "🏆";
      case 'INITIAL_CERTIFICATION': return "⭐";
      case 'GAP_ANALYSIS': return "📊";
      case 'CONSULTING': return "💼";
      case 'TRAINING': return "📚";
      default: return "📝";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(2)}h`;
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = filteredData.length;
    const approved = filteredData.filter(t => t.approved).length;
    const billable = filteredData.filter(t => t.billable_status === 'BILLABLE').length;
    const totalHours = filteredData.reduce((sum, t) => sum + (t.total_hours || 0), 0);
    const totalAmount = filteredData.reduce((sum, t) => sum + (t.calculated_amount || t.amount || 0), 0);
    
    return { total, approved, billable, totalHours, totalAmount };
  }, [filteredData]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Time Sheets
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage employee timesheet entries based on ISO audit data structure
            </p>
          </div>
          {!loading && (
          <div className="flex gap-2">
            <Link href="/timesheets/new">
              <Button variant="secondary">+ New Entry</Button>
            </Link>
            <Link href="/billing">
              <Button variant="secondary">📊 Billing View</Button>
            </Link>
            {selectedItems.size > 0 && (
              <Button variant="primary" onClick={handleBulkApprove}>
                ✓ Approve ({selectedItems.size})
              </Button>
            )}
          </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading timesheet data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && !error && (
        <>
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {summaryStats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {summaryStats.approved}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {summaryStats.billable}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Billable</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">
              {formatHours(summaryStats.totalHours)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Hours</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(summaryStats.totalAmount)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <WidgetCard title="Filters & Search">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Employees</option>
                {uniqueEmployees.map(employee => (
                  <option key={employee} value={employee}>{employee}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="billable">Billable</option>
                <option value="non_billable">Non-Billable</option>
                <option value="billed">Billed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search certificate, description, project code..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={approvedOnly}
                onChange={(e) => setApprovedOnly(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm">Approved Only</span>
            </label>
          </div>
        </WidgetCard>

        {/* TimeSheets Table */}
        <WidgetCard title={`TimeSheet Entries (${filteredData.length})`}>
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === filteredData.length && filteredData.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Certificate No</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Task</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Auditor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Hours</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((timesheet) => (
                    <tr key={timesheet.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(timesheet.id)}
                          onChange={() => handleSelectItem(timesheet.id)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        {new Date(timesheet.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        <div className="font-medium">{timesheet.certificate_no}</div>
                        <div className="text-xs text-gray-500">{timesheet.project_code}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTaskTypeIcon(timesheet.task_name)}</span>
                          <span>{timesheet.task_name_display}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        <div>{timesheet.employee_name}</div>
                        <div className="text-xs text-gray-500">{timesheet.employee_email}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        <div>Reg: {formatHours(timesheet.regular_hours)}</div>
                        {timesheet.overtime_hours > 0 && (
                          <div className="text-orange-600">OT: {formatHours(timesheet.overtime_hours)}</div>
                        )}
                        <div className="font-semibold">Total: {formatHours(timesheet.total_hours)}</div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-dark dark:text-white">
                        {formatCurrency(timesheet.calculated_amount || timesheet.amount || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(timesheet.billable_status, timesheet.billed_status)}`}>
                            {timesheet.billable_status_display}
                          </span>
                          <div className="text-xs text-gray-500">
                            {timesheet.billed_status_display}
                          </div>
                          {timesheet.approved && (
                            <div className="text-xs text-green-600">✓ Approved</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                        <div className="truncate" title={timesheet.notes}>
                          {timesheet.notes || timesheet.work_description || 'No notes'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                No timesheet entries found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or add new timesheet entries.
              </p>
            </div>
          )}
        </WidgetCard>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}