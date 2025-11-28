"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";
import { Badge } from "@/components/Dashboard/badge";
import { Payroll, PayrollStatus } from "@/types/audit";

// Mock payroll data
const MOCK_PAYROLL: Record<string, Payroll> = {
  "1": {
    id: "1",
    employeeId: "1",
    employeeName: "John Smith",
    department: "Audit Operations",
    payPeriod: "monthly",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-31"),
    baseSalary: 5000,
    earnings: [{ type: "bonus", description: "Performance Bonus", amount: 500 }],
    deductions: [
      { type: "tax", description: "Federal Tax", amount: 800 },
      { type: "insurance", description: "Health Insurance", amount: 200 },
    ],
    grossPay: 5500,
    totalDeductions: 1000,
    netPay: 4500,
    status: "draft",
    paymentMethod: "bank-transfer",
    paymentDate: new Date("2024-11-05"),
  },
};

const statusVariants: Record<PayrollStatus, "success" | "warning" | "error" | "info" | "neutral"> = {
  draft: "neutral",
  pending: "info",
  approved: "warning",
  paid: "success",
  cancelled: "error",
};

const statusLabels: Record<PayrollStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  cancelled: "Cancelled",
};

const payPeriodLabels: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  "bi-weekly": "Bi-Weekly",
  monthly: "Monthly",
  dynamic: "Dynamic",
};

const paymentMethodLabels: Record<string, string> = {
  "bank-transfer": "Bank Transfer",
  check: "Check",
  cash: "Cash",
  "direct-deposit": "Direct Deposit",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const payroll = MOCK_PAYROLL[id];

  const [isEditingPaymentDate, setIsEditingPaymentDate] = useState(false);
  const [newPaymentDate, setNewPaymentDate] = useState(
    payroll?.paymentDate ? new Date(payroll.paymentDate).toISOString().split('T')[0] : ""
  );
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: "1",
      previousDate: new Date("2024-11-05"),
      newDate: new Date("2024-11-10"),
      changedBy: "Admin User",
      changedAt: new Date("2024-10-28"),
      reason: "Employee request - bank processing delay",
    },
  ]);

  if (!payroll) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Payroll record not found</p>
          <Button onClick={() => router.push("/payroll")}>Back to Payroll</Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = payroll.status as PayrollStatus;

  const handleSavePaymentDate = () => {
    // In a real app, this would make an API call
    const newHistory = {
      id: String(paymentHistory.length + 1),
      previousDate: payroll.paymentDate || new Date(),
      newDate: new Date(newPaymentDate),
      changedBy: "Current User",
      changedAt: new Date(),
      reason: "Payment date updated",
    };
    setPaymentHistory([newHistory, ...paymentHistory]);
    setIsEditingPaymentDate(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-white">{payroll.employeeName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{payroll.department}</p>
          </div>
          <div className="flex gap-4 items-start">
            <Badge label={statusLabels[status]} variant={statusVariants[status]} />
            <Button onClick={() => router.push("/payroll")}>Back</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pay Period Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Pay Period Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pay Period Type</p>
                  <p className="text-lg font-medium text-dark dark:text-white mt-1">
                    {payPeriodLabels[payroll.payPeriod]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-lg font-medium text-dark dark:text-white mt-1">
                    {statusLabels[status]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                  <p className="text-lg font-medium text-dark dark:text-white mt-1">
                    {new Date(payroll.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                  <p className="text-lg font-medium text-dark dark:text-white mt-1">
                    {new Date(payroll.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Earnings</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Base Salary</span>
                  <span className="font-medium text-dark dark:text-white">
                    {formatCurrency(payroll.baseSalary)}
                  </span>
                </div>
                {payroll.earnings.map((earning, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {earning.description || earning.type}
                    </span>
                    <span className="font-medium text-dark dark:text-white">
                      {formatCurrency(earning.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Deductions</h2>
              <div className="space-y-3">
                {payroll.deductions.map((deduction, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {deduction.description || deduction.type}
                    </span>
                    <span className="font-medium text-error">
                      {formatCurrency(deduction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Payment Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="text-lg font-medium text-dark dark:text-white mt-1">
                    {paymentMethodLabels[payroll.paymentMethod]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                  <p className="text-lg font-medium text-dark dark:text-white mt-1">
                    {payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                {payroll.approvedBy && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Approved By</p>
                    <p className="text-lg font-medium text-dark dark:text-white mt-1">
                      {payroll.approvedBy}
                    </p>
                  </div>
                )}
                {payroll.approvedDate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Approved Date</p>
                    <p className="text-lg font-medium text-dark dark:text-white mt-1">
                      {new Date(payroll.approvedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-fit">
            <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Gross Pay</span>
                <span className="font-bold text-dark dark:text-white">
                  {formatCurrency(payroll.grossPay)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Deductions</span>
                <span className="font-bold text-error">
                  {formatCurrency(payroll.totalDeductions)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                <span className="font-bold text-dark dark:text-white">Net Pay</span>
                <span className="font-bold text-success text-lg">
                  {formatCurrency(payroll.netPay)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              {status === "draft" && (
                <Button
                  onClick={() => router.push(`/payroll/${payroll.id}/edit`)}
                  className="w-full"
                >
                  Edit Payroll
                </Button>
              )}
              <Button
                onClick={() => router.push("/payroll")}
                variant="secondary"
                className="w-full"
              >
                Back to List
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Date Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-dark dark:text-white">Payment Date Management</h2>
            {!isEditingPaymentDate && (
              <Button
                onClick={() => setIsEditingPaymentDate(true)}
                variant="secondary"
                size="sm"
              >
                Update Payment Date
              </Button>
            )}
          </div>

          {/* Current Payment Date */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Payment Date</p>
                <p className="text-lg font-bold text-dark dark:text-white mt-1">
                  {payroll.paymentDate
                    ? new Date(payroll.paymentDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not set"}
                </p>
              </div>
              {payroll.paymentDate && (
                <Badge
                  label={
                    new Date(payroll.paymentDate) > new Date()
                      ? "Upcoming"
                      : "Past Due"
                  }
                  variant={
                    new Date(payroll.paymentDate) > new Date()
                      ? "info"
                      : "warning"
                  }
                />
              )}
            </div>
          </div>

          {/* Edit Payment Date Form */}
          {isEditingPaymentDate && (
            <div className="mb-6 p-4 border border-primary rounded-lg bg-primary/5">
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                Update Payment Date
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Payment Date
                  </label>
                  <input
                    type="date"
                    value={newPaymentDate}
                    onChange={(e) => setNewPaymentDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSavePaymentDate} size="sm">
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingPaymentDate(false);
                      setNewPaymentDate(
                        payroll.paymentDate
                          ? new Date(payroll.paymentDate).toISOString().split('T')[0]
                          : ""
                      );
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Date History */}
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
              Payment Date History
            </h3>
            {paymentHistory.length > 0 ? (
              <div className="space-y-3">
                {paymentHistory.map((history) => (
                  <div
                    key={history.id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Changed from
                          </span>
                          <span className="font-medium text-dark dark:text-white">
                            {new Date(history.previousDate).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-primary">
                            {new Date(history.newDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {history.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>Changed by: {history.changedBy}</span>
                      <span>•</span>
                      <span>
                        {new Date(history.changedAt).toLocaleDateString()} at{" "}
                        {new Date(history.changedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No payment date changes recorded
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

