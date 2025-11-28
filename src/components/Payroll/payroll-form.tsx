"use client";

import { useState } from "react";
import { Payroll, PayPeriodType, PaymentMethod, EarningType, DeductionType, Employee } from "@/types/audit";
import { FormInput } from "@/components/Dashboard/form-input";
import { Button } from "@/components/Dashboard/button";
import { useForm } from "@/hooks/useForm";

interface PayrollFormProps {
  payroll?: Payroll;
  employees?: Employee[];
  onSubmit: (data: Payroll) => Promise<void>;
  isLoading?: boolean;
}

const PAY_PERIODS: PayPeriodType[] = ["daily", "weekly", "bi-weekly", "monthly", "dynamic"];
const PAYMENT_METHODS: PaymentMethod[] = ["bank-transfer", "check", "cash", "direct-deposit"];
const EARNING_TYPES: EarningType[] = ["base-salary", "overtime", "bonus", "allowance", "commission", "audit-commission"];
const DEDUCTION_TYPES: DeductionType[] = ["tax", "insurance", "retirement", "loan", "other"];

const payPeriodLabels: Record<PayPeriodType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  "bi-weekly": "Bi-Weekly",
  monthly: "Monthly",
  dynamic: "Dynamic (Custom Date Range)",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  "bank-transfer": "Bank Transfer",
  check: "Check",
  cash: "Cash",
  "direct-deposit": "Direct Deposit",
};

const earningTypeLabels: Record<EarningType, string> = {
  "base-salary": "Base Salary",
  overtime: "Overtime",
  bonus: "Bonus",
  allowance: "Allowance",
  commission: "Commission",
  "audit-commission": "Audit Commission",
};

const deductionTypeLabels: Record<DeductionType, string> = {
  tax: "Tax",
  insurance: "Insurance",
  retirement: "Retirement",
  loan: "Loan",
  other: "Other",
};

export function PayrollForm({ payroll, employees = [], onSubmit, isLoading = false }: PayrollFormProps) {
  const [earnings, setEarnings] = useState(payroll?.earnings || []);
  const [deductions, setDeductions] = useState(payroll?.deductions || []);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    employees.find(e => e.id === payroll?.employeeId) || null
  );
  const [auditCommissionEnabled, setAuditCommissionEnabled] = useState(false);
  const [auditsCompleted, setAuditsCompleted] = useState(0);

  const initialValues: Payroll = payroll || {
    id: "",
    employeeId: "",
    payPeriod: "monthly",
    startDate: new Date(),
    endDate: new Date(),
    baseSalary: 0,
    earnings: [],
    deductions: [],
    grossPay: 0,
    totalDeductions: 0,
    netPay: 0,
    status: "draft",
    paymentMethod: "bank-transfer",
  };

  const validate = (values: Payroll) => {
    const errors: Partial<Record<keyof Payroll, string>> = {};

    if (!values.employeeId?.trim()) errors.employeeId = "Employee is required";
    if (values.baseSalary <= 0) errors.baseSalary = "Base salary must be greater than 0";
    if (!values.paymentMethod?.trim()) errors.paymentMethod = "Payment method is required";

    return errors;
  };

  const form = useForm({
    initialValues,
    onSubmit: async (values) => {
      const grossPay = values.baseSalary + earnings.reduce((sum, e) => sum + e.amount, 0);
      const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
      const netPay = grossPay - totalDeductions;

      await onSubmit({
        ...values,
        earnings,
        deductions,
        grossPay,
        totalDeductions,
        netPay,
      });
    },
    validate,
  });

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    setSelectedEmployee(employee || null);
    form.handleChange("employeeId", employeeId);

    // Auto-calculate audit commission if enabled for this employee
    if (employee?.commissionEnabled && employee?.commissionRate) {
      setAuditCommissionEnabled(true);
      setAuditsCompleted(employee.auditCount || 0);
    } else {
      setAuditCommissionEnabled(false);
      setAuditsCompleted(0);
    }
  };

  const calculateAuditCommission = () => {
    if (!selectedEmployee?.commissionEnabled || !selectedEmployee?.commissionRate) {
      return 0;
    }
    // Commission = number of audits * commission rate
    return auditsCompleted * selectedEmployee.commissionRate;
  };

  const addAuditCommission = () => {
    const commissionAmount = calculateAuditCommission();
    if (commissionAmount > 0) {
      const existingCommissionIndex = earnings.findIndex(e => e.type === "audit-commission");
      if (existingCommissionIndex >= 0) {
        // Update existing commission
        updateEarning(existingCommissionIndex, "amount", commissionAmount);
      } else {
        // Add new commission
        setEarnings([
          ...earnings,
          {
            type: "audit-commission",
            description: `Commission for ${auditsCompleted} audits @ $${selectedEmployee?.commissionRate}/audit`,
            amount: commissionAmount,
          },
        ]);
      }
    }
  };

  const addEarning = () => {
    setEarnings([...earnings, { type: "bonus", description: "", amount: 0 }]);
  };

  const removeEarning = (index: number) => {
    setEarnings(earnings.filter((_, i) => i !== index));
  };

  const updateEarning = (index: number, field: string, value: any) => {
    const updated = [...earnings];
    updated[index] = { ...updated[index], [field]: value };
    setEarnings(updated);
  };

  const addDeduction = () => {
    setDeductions([...deductions, { type: "tax", description: "", amount: 0 }]);
  };

  const removeDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const updateDeduction = (index: number, field: string, value: any) => {
    const updated = [...deductions];
    updated[index] = { ...updated[index], [field]: value };
    setDeductions(updated);
  };

  const grossPay = form.values.baseSalary + earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const netPay = grossPay - totalDeductions;

  return (
    <form onSubmit={form.handleSubmit} className="space-y-8">
      {/* Employee & Pay Period Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Employee & Pay Period</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Employee *
            </label>
            <select
              value={form.values.employeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              onBlur={() => form.handleBlur("employeeId")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                  {emp.commissionEnabled && " (Commission Enabled)"}
                </option>
              ))}
            </select>
            {form.errors.employeeId && (
              <p className="text-error text-sm mt-1">{form.errors.employeeId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Pay Period *
            </label>
            <select
              value={form.values.payPeriod}
              onChange={(e) => form.handleChange("payPeriod", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PAY_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {payPeriodLabels[period]}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Start Date"
            type="date"
            value={form.values.startDate instanceof Date ? form.values.startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => form.handleChange("startDate", new Date(e.target.value))}
          />

          <FormInput
            label="End Date"
            type="date"
            value={form.values.endDate instanceof Date ? form.values.endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => form.handleChange("endDate", new Date(e.target.value))}
          />

          <FormInput
            label="Base Salary *"
            type="number"
            step="0.01"
            value={form.values.baseSalary}
            onChange={(e) => form.handleChange("baseSalary", parseFloat(e.target.value) || 0)}
            error={form.errors.baseSalary}
          />

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">
              Payment Method *
            </label>
            <select
              value={form.values.paymentMethod}
              onChange={(e) => form.handleChange("paymentMethod", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {paymentMethodLabels[method]}
                </option>
              ))}
            </select>
            {form.errors.paymentMethod && (
              <p className="text-error text-sm mt-1">{form.errors.paymentMethod}</p>
            )}
          </div>

          <FormInput
            label="Payment Date"
            type="date"
            value={form.values.paymentDate instanceof Date ? form.values.paymentDate.toISOString().split('T')[0] : ''}
            onChange={(e) => form.handleChange("paymentDate", new Date(e.target.value))}
          />
        </div>
      </div>

      {/* Audit Commission Section */}
      {selectedEmployee?.commissionEnabled && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg border border-primary/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">Audit Commission</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Commission Rate: ${selectedEmployee.commissionRate}/audit
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Audits Completed</p>
              <p className="text-2xl font-bold text-primary">{selectedEmployee.auditCount || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Audits Completed This Period
              </label>
              <input
                type="number"
                min="0"
                value={auditsCompleted}
                onChange={(e) => setAuditsCompleted(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Commission Rate
              </label>
              <input
                type="text"
                value={`$${selectedEmployee.commissionRate}/audit`}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-dark dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                Total Commission
              </label>
              <input
                type="text"
                value={`$${calculateAuditCommission().toFixed(2)}`}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-dark dark:text-white font-bold"
              />
            </div>
          </div>

          <Button onClick={addAuditCommission} variant="secondary" size="sm">
            Add Commission to Earnings
          </Button>
        </div>
      )}

      {/* Earnings Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">Earnings</h2>
          <Button onClick={addEarning} variant="secondary" size="sm">
            + Add Earning
          </Button>
        </div>

        <div className="space-y-4">
          {earnings.map((earning, index) => (
            <div key={index} className="flex gap-4 items-end">
              <select
                value={earning.type}
                onChange={(e) => updateEarning(index, "type", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                {EARNING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {earningTypeLabels[type]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={earning.description}
                onChange={(e) => updateEarning(index, "description", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
              <input
                type="number"
                placeholder="Amount"
                step="0.01"
                value={earning.amount}
                onChange={(e) => updateEarning(index, "amount", parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeEarning(index)}
                className="px-3 py-2 text-error hover:bg-error/10 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deductions Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">Deductions</h2>
          <Button onClick={addDeduction} variant="secondary" size="sm">
            + Add Deduction
          </Button>
        </div>

        <div className="space-y-4">
          {deductions.map((deduction, index) => (
            <div key={index} className="flex gap-4 items-end">
              <select
                value={deduction.type}
                onChange={(e) => updateDeduction(index, "type", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              >
                {DEDUCTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {deductionTypeLabels[type]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={deduction.description}
                onChange={(e) => updateDeduction(index, "description", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
              <input
                type="number"
                placeholder="Amount"
                step="0.01"
                value={deduction.amount}
                onChange={(e) => updateDeduction(index, "amount", parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeDeduction(index)}
                className="px-3 py-2 text-error hover:bg-error/10 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span className="text-dark dark:text-white">Gross Pay:</span>
            <span className="font-bold text-dark dark:text-white">${grossPay.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-dark dark:text-white">Total Deductions:</span>
            <span className="font-bold text-error">${totalDeductions.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="font-bold text-dark dark:text-white">Net Pay:</span>
            <span className="font-bold text-success">${netPay.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Payroll"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

