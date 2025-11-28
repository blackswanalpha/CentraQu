"use client";

import { Payroll } from "@/types/audit";
import { Modal } from "@/components/Dashboard/modal";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { useState } from "react";

interface ApprovePayrollModalProps {
  isOpen: boolean;
  payroll: Payroll | null;
  onConfirm: (approvedBy: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function ApprovePayrollModal({
  isOpen,
  payroll,
  onConfirm,
  onCancel,
  isLoading = false,
}: ApprovePayrollModalProps) {
  const [approvedBy, setApprovedBy] = useState("");

  const handleConfirm = async () => {
    if (!approvedBy.trim()) {
      alert("Please enter approver name");
      return;
    }
    await onConfirm(approvedBy);
    setApprovedBy("");
  };

  if (!payroll) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Approve Payroll">
      <div className="space-y-6">
        {/* Payroll Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Employee:</span>
            <span className="font-medium text-dark dark:text-white">{payroll.employeeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Pay Period:</span>
            <span className="font-medium text-dark dark:text-white">
              {new Date(payroll.startDate).toLocaleDateString()} - {new Date(payroll.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Gross Pay:</span>
            <span className="font-medium text-dark dark:text-white">{formatCurrency(payroll.grossPay)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Deductions:</span>
            <span className="font-medium text-error">{formatCurrency(payroll.totalDeductions)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
            <span className="font-bold text-dark dark:text-white">Net Pay:</span>
            <span className="font-bold text-success">{formatCurrency(payroll.netPay)}</span>
          </div>
        </div>

        {/* Approver Information */}
        <FormInput
          label="Approved By *"
          placeholder="Enter your name"
          value={approvedBy}
          onChange={(e) => setApprovedBy(e.target.value)}
        />

        {/* Warning */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-accent">
            ⚠️ Approving this payroll will move it to the next stage. Please review all details carefully.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !approvedBy.trim()}
            className="flex-1"
          >
            {isLoading ? "Approving..." : "Approve Payroll"}
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

