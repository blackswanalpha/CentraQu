"use client";

import { Payroll } from "@/types/audit";
import { Modal } from "@/components/Dashboard/modal";
import { Button } from "@/components/Dashboard/button";

interface ProcessPaymentModalProps {
  isOpen: boolean;
  payroll: Payroll | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const paymentMethodLabels: Record<string, string> = {
  "bank-transfer": "Bank Transfer",
  check: "Check",
  cash: "Cash",
  "direct-deposit": "Direct Deposit",
};

export function ProcessPaymentModal({
  isOpen,
  payroll,
  onConfirm,
  onCancel,
  isLoading = false,
}: ProcessPaymentModalProps) {
  if (!payroll) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Process Payment">
      <div className="space-y-6">
        {/* Payment Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Employee:</span>
            <span className="font-medium text-dark dark:text-white">{payroll.employeeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
            <span className="font-medium text-dark dark:text-white">
              {paymentMethodLabels[payroll.paymentMethod] || payroll.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Payment Date:</span>
            <span className="font-medium text-dark dark:text-white">
              {payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString() : "Not set"}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
            <span className="font-bold text-dark dark:text-white">Amount to Pay:</span>
            <span className="font-bold text-success text-lg">{formatCurrency(payroll.netPay)}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-dark dark:text-white mb-3">Payment Breakdown</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Gross Pay:</span>
            <span className="text-dark dark:text-white">{formatCurrency(payroll.grossPay)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Deductions:</span>
            <span className="text-error">{formatCurrency(payroll.totalDeductions)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-600 pt-2">
            <span className="font-bold text-dark dark:text-white">Net Pay:</span>
            <span className="font-bold text-success">{formatCurrency(payroll.netPay)}</span>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-success">
            ✓ This payment will be processed immediately. The payroll status will be updated to "Paid".
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

