"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { PayrollCard } from "@/components/Payroll/payroll-card";
import { ApprovePayrollModal } from "@/components/Payroll/approve-payroll-modal";
import { ProcessPaymentModal } from "@/components/Payroll/process-payment-modal";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { Payroll, PayrollStatus, PayPeriodType } from "@/types/audit";
import { payrollService, Payroll as APIPayroll } from "@/services/payroll.service";
import Link from "next/link";

// Helper function to convert API payroll to frontend format
const convertToPayroll = (apiPayroll: APIPayroll): Payroll => {
  // Convert status from Django format (DRAFT, PENDING, etc.) to frontend format (draft, pending, etc.)
  const statusMap: Record<string, PayrollStatus> = {
    'DRAFT': 'draft',
    'PENDING': 'pending',
    'APPROVED': 'approved',
    'PAID': 'paid',
    'CANCELLED': 'cancelled',
  };

  // Convert pay period from Django format to frontend format
  const payPeriodMap: Record<string, PayPeriodType> = {
    'DAILY': 'daily',
    'WEEKLY': 'weekly',
    'BI_WEEKLY': 'bi-weekly',
    'MONTHLY': 'monthly',
    'DYNAMIC': 'dynamic',
  };

  // Convert payment method from Django format to frontend format
  const paymentMethodMap: Record<string, any> = {
    'BANK_TRANSFER': 'bank-transfer',
    'CASH': 'cash',
    'CHEQUE': 'check',
    'MPESA': 'direct-deposit',
    'OTHER': 'bank-transfer',
  };

  // Convert earning types
  const earningTypeMap: Record<string, any> = {
    'BONUS': 'bonus',
    'COMMISSION': 'commission',
    'OVERTIME': 'overtime',
    'ALLOWANCE': 'allowance',
    'REIMBURSEMENT': 'bonus',
    'OTHER': 'bonus',
  };

  // Convert deduction types
  const deductionTypeMap: Record<string, any> = {
    'TAX': 'tax',
    'INSURANCE': 'insurance',
    'PENSION': 'retirement',
    'LOAN': 'loan',
    'ADVANCE': 'other',
    'OTHER': 'other',
  };

  return {
    id: apiPayroll.id?.toString() || '',
    employeeId: apiPayroll.employee.toString(),
    employeeName: apiPayroll.employee_name || '',
    department: apiPayroll.department || '',
    payPeriod: payPeriodMap[apiPayroll.pay_period] || 'monthly',
    startDate: new Date(apiPayroll.start_date),
    endDate: new Date(apiPayroll.end_date),
    baseSalary: Number(apiPayroll.base_salary),
    earnings: (apiPayroll.earnings || []).map(e => ({
      type: earningTypeMap[e.earning_type] || 'bonus',
      description: e.description,
      amount: Number(e.amount),
    })),
    deductions: (apiPayroll.deductions || []).map(d => ({
      type: deductionTypeMap[d.deduction_type] || 'other',
      description: d.description,
      amount: Number(d.amount),
    })),
    grossPay: Number(apiPayroll.gross_pay),
    totalDeductions: Number(apiPayroll.total_deductions),
    netPay: Number(apiPayroll.net_pay),
    status: statusMap[apiPayroll.status] || 'draft',
    paymentMethod: paymentMethodMap[apiPayroll.payment_method] || 'bank-transfer',
    paymentDate: apiPayroll.payment_date ? new Date(apiPayroll.payment_date) : undefined,
    approvedBy: apiPayroll.approved_by_name,
    approvedDate: apiPayroll.approved_date ? new Date(apiPayroll.approved_date) : undefined,
    processedDate: apiPayroll.processed_date ? new Date(apiPayroll.processed_date) : undefined,
    notes: apiPayroll.notes,
    createdAt: apiPayroll.created_at ? new Date(apiPayroll.created_at) : undefined,
    updatedAt: apiPayroll.updated_at ? new Date(apiPayroll.updated_at) : undefined,
  };
};

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayrollStatus | "all">("all");
  const [periodFilter, setPeriodFilter] = useState<PayPeriodType | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [approveModal, setApproveModal] = useState<{
    isOpen: boolean;
    payroll: Payroll | null;
  }>({ isOpen: false, payroll: null });
  const [processModal, setProcessModal] = useState<{
    isOpen: boolean;
    payroll: Payroll | null;
  }>({ isOpen: false, payroll: null });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payroll records from API
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await payrollService.getPayrolls({ ordering: '-start_date' });
        const convertedPayroll = response.results.map(convertToPayroll);
        setPayroll(convertedPayroll);
      } catch (err) {
        console.error('Error fetching payroll:', err);
        setError('Failed to load payroll records');
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, []);

  // Filter payroll records
  const filteredPayroll = useMemo(() => {
    return payroll.filter((record) => {
      const matchesSearch =
        !searchTerm ||
        record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesPeriod = periodFilter === "all" || record.payPeriod === periodFilter;
      const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesPeriod && matchesDepartment;
    });
  }, [payroll, searchTerm, statusFilter, periodFilter, departmentFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = payroll.reduce((sum, p) => sum + p.netPay, 0);
    const pending = payroll
      .filter((p) => p.status === "pending" || p.status === "draft")
      .reduce((sum, p) => sum + p.netPay, 0);
    const completed = payroll
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.netPay, 0);
    const average = payroll.length > 0 ? total / payroll.length : 0;

    return { total, pending, completed, average };
  }, [payroll]);

  const handleApprove = async (approvedBy: string) => {
    if (!approveModal.payroll) return;
    setIsLoading(true);
    try {
      const updated = await payrollService.approvePayroll(Number(approveModal.payroll.id));
      const convertedPayroll = convertToPayroll(updated);
      setPayroll(
        payroll.map((p) =>
          p.id === approveModal.payroll?.id ? convertedPayroll : p
        )
      );
      setApproveModal({ isOpen: false, payroll: null });
    } catch (err) {
      console.error('Error approving payroll:', err);
      alert('Failed to approve payroll');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!processModal.payroll) return;
    setIsLoading(true);
    try {
      const updated = await payrollService.processPayment(Number(processModal.payroll.id));
      const convertedPayroll = convertToPayroll(updated);
      setPayroll(
        payroll.map((p) =>
          p.id === processModal.payroll?.id ? convertedPayroll : p
        )
      );
      setProcessModal({ isOpen: false, payroll: null });
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const departments = Array.from(new Set(payroll.map((p) => p.department).filter(Boolean)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-white">Payroll Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage employee payroll records</p>
          </div>
          <Link href="/payroll/new">
            <Button>+ Create Payroll</Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Payroll</p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-2">
              ${stats.total.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
            <p className="text-2xl font-bold text-accent dark:text-accent mt-2">
              ${stats.pending.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed Payments</p>
            <p className="text-2xl font-bold text-success dark:text-success mt-2">
              ${stats.completed.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Salary</p>
            <p className="text-2xl font-bold text-primary dark:text-primary mt-2">
              ${stats.average.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FormInput
              placeholder="Search by employee or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PayrollStatus | "all")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as PayPeriodType | "all")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
            >
              <option value="all">All Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="dynamic">Dynamic</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payroll List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayroll.length > 0 ? (
            filteredPayroll.map((record) => (
              <PayrollCard
                key={record.id}
                payroll={record}
                onApprove={() => setApproveModal({ isOpen: true, payroll: record })}
                onProcess={() => setProcessModal({ isOpen: true, payroll: record })}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No payroll records found</p>
            </div>
          )}
        </div>

        {/* Modals */}
        <ApprovePayrollModal
          isOpen={approveModal.isOpen}
          payroll={approveModal.payroll}
          onConfirm={handleApprove}
          onCancel={() => setApproveModal({ isOpen: false, payroll: null })}
          isLoading={isLoading}
        />
        <ProcessPaymentModal
          isOpen={processModal.isOpen}
          payroll={processModal.payroll}
          onConfirm={handleProcess}
          onCancel={() => setProcessModal({ isOpen: false, payroll: null })}
          isLoading={isLoading}
        />
      </>
        )}
      </div>
    </DashboardLayout>
  );
}

