"use client";

import { useRouter } from "next/navigation";
import { Payroll, PayrollStatus } from "@/types/audit";
import { Badge } from "@/components/Dashboard/badge";

interface PayrollCardProps {
  payroll: Payroll;
  onEdit?: (payroll: Payroll) => void;
  onDelete?: (payrollId: string) => void;
  onApprove?: (payrollId: string) => void;
  onProcess?: (payrollId: string) => void;
}

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function PayrollCard({ payroll, onEdit, onDelete, onApprove, onProcess }: PayrollCardProps) {
  const router = useRouter();
  const status = payroll.status as PayrollStatus;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            onClick={() => router.push(`/payroll/${payroll.id}`)}
            className="text-lg font-bold text-dark dark:text-white hover:text-primary transition-colors cursor-pointer"
          >
            {payroll.employeeName || "Unknown Employee"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {payroll.department || "—"}
          </p>
        </div>
        <Badge
          label={statusLabels[status]}
          variant={statusVariants[status]}
        />
      </div>

      {/* Pay Period Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Pay Period:</span> {payPeriodLabels[payroll.payPeriod] || payroll.payPeriod}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Period:</span>{" "}
          {new Date(payroll.startDate).toLocaleDateString()} - {new Date(payroll.endDate).toLocaleDateString()}
        </p>
        {payroll.paymentDate && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Payment Date:</span> {new Date(payroll.paymentDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Gross Pay</p>
          <p className="text-lg font-bold text-dark dark:text-white">
            {formatCurrency(payroll.grossPay)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Deductions</p>
          <p className="text-sm font-medium text-error">
            {formatCurrency(payroll.totalDeductions)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Net Pay</p>
          <p className="text-sm font-bold text-success">
            {formatCurrency(payroll.netPay)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => router.push(`/payroll/${payroll.id}`)}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors text-center"
        >
          View Details
        </button>
        {status === "draft" && onEdit && (
          <button
            onClick={() => onEdit(payroll)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
        {status === "pending" && onApprove && (
          <button
            onClick={() => onApprove(payroll.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-success hover:bg-success/10 rounded-lg transition-colors"
          >
            Approve
          </button>
        )}
        {status === "approved" && onProcess && (
          <button
            onClick={() => onProcess(payroll.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-success hover:bg-success/10 rounded-lg transition-colors"
          >
            Process
          </button>
        )}
        {(status === "draft" || status === "pending") && onDelete && (
          <button
            onClick={() => onDelete(payroll.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

