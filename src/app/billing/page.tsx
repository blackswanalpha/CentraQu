"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Button } from "@/components/Dashboard/button";
import { billingService, BillingItem, BillingStats } from "@/services/billing.service";
import Link from "next/link";

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingItem[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [approvedOnly, setApprovedOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Selection for bulk operations
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Fetch billing data from API
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set default date range to current month if not set
        const now = new Date();
        const defaultDateFrom = dateFrom || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const defaultDateTo = dateTo || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const [billingResponse, statsResponse] = await Promise.all([
          billingService.getBillingData({
            date_from: defaultDateFrom,
            date_to: defaultDateTo,
            status: selectedStatus !== "all" ? selectedStatus as any : undefined,
            approved_only: approvedOnly || undefined,
            ordering: '-date',
          }),
          billingService.getBillingStats({
            date_from: defaultDateFrom,
            date_to: defaultDateTo,
          })
        ]);

        setBillingData(billingResponse.results);
        setStats(statsResponse);
      } catch (err) {
        console.error('Error fetching billing data:', err);
        setError('Failed to load billing data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch
    const timeoutId = setTimeout(() => {
      fetchBillingData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dateFrom, dateTo, selectedClient, selectedEmployee, selectedStatus, approvedOnly]);

  // Filter data based on search and selections
  const filteredData = useMemo(() => {
    return billingData.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClient = selectedClient === "all" || item.client_name === selectedClient;
      const matchesEmployee = selectedEmployee === "all" || item.employee_name === selectedEmployee;
      
      return matchesSearch && matchesClient && matchesEmployee;
    });
  }, [billingData, searchTerm, selectedClient, selectedEmployee]);

  // Get unique values for dropdowns
  const uniqueClients = useMemo(() => {
    return Array.from(new Set(billingData.map(item => item.client_name).filter(Boolean)));
  }, [billingData]);

  const uniqueEmployees = useMemo(() => {
    return Array.from(new Set(billingData.map(item => item.employee_name).filter(Boolean)));
  }, [billingData]);

  const handleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredData.map(item => item.id)));
    }
  };

  const handleSelectItem = (itemId: string) => {
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
      // For now, just update local state
      setBillingData(prev => prev.map(item => 
        selectedItems.has(item.id) ? { ...item, approved: true, status: 'billable' } : item
      ));
      setSelectedItems(new Set());
    } catch (err) {
      console.error('Error approving items:', err);
    }
  };

  const handleGenerateInvoice = async () => {
    if (selectedItems.size === 0) return;
    
    try {
      console.log('Generating invoice for items:', Array.from(selectedItems));
      // Would call billing service to generate invoice
      setSelectedItems(new Set());
    } catch (err) {
      console.error('Error generating invoice:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "billable": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "billed": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "non_billable": return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Billing & Time Tracking
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage timesheets, track billable hours, and generate invoices
            </p>
          </div>
          {!loading && (
          <div className="flex gap-2">
            <Link href="/billing/timesheets/new">
              <Button variant="secondary">+ New Timesheet</Button>
            </Link>
            {selectedItems.size > 0 && (
              <>
                <Button variant="secondary" onClick={handleBulkApprove}>
                  ✓ Approve ({selectedItems.size})
                </Button>
                <Button variant="primary" onClick={handleGenerateInvoice}>
                  📄 Generate Invoice
                </Button>
              </>
            )}
          </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading billing data...</p>
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
        {/* Statistics Cards */}
        {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-dark dark:text-white">
              {formatHours(stats.total_hours)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Hours</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {formatHours(stats.billable_hours)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Billable Hours</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.total_revenue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.pending_revenue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending Revenue</div>
          </div>
        </div>
        )}

        {/* Filters */}
        <WidgetCard title="Filters">
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
              <label className="block text-sm font-medium mb-2">Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                <option value="all">All Clients</option>
                {uniqueClients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
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
                <option value="billed">Billed</option>
                <option value="non_billable">Non-Billable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
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

        {/* Billing Data Table */}
        <WidgetCard title={`Billing Data (${filteredData.length} entries)`}>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Project</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Hours</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        {item.employee_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        {item.client_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        {item.project_code}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        <div>
                          <div>Reg: {formatHours(item.regular_hours)}</div>
                          {item.overtime_hours > 0 && (
                            <div className="text-orange-600">OT: {formatHours(item.overtime_hours)}</div>
                          )}
                          <div className="font-semibold">Total: {formatHours(item.total_hours)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark dark:text-white">
                        {formatCurrency(item.hourly_rate)}/hr
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-dark dark:text-white">
                        {formatCurrency(item.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        {item.approved && (
                          <div className="text-xs text-green-600 mt-1">✓ Approved</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-xs text-primary hover:text-primary-hover">
                            Edit
                          </button>
                          <button className="text-xs text-primary hover:text-primary-hover">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
                No billing data found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or add some timesheet entries.
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