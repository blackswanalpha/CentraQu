"use client";

import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { useState, use } from "react";

export default function AuditExpenseTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  use(params);
  const [expenses, setExpenses] = useState([
    {
      id: "EXP-001",
      date: "2025-09-15",
      category: "travel",
      description: "Flight - Nairobi to Mombasa",
      amount: 15000,
      currency: "KES",
      status: "approved",
      receipt: true,
    },
    {
      id: "EXP-002",
      date: "2025-09-15",
      category: "accommodation",
      description: "Hotel - 3 nights",
      amount: 18000,
      currency: "KES",
      status: "approved",
      receipt: true,
    },
    {
      id: "EXP-003",
      date: "2025-09-16",
      category: "meals",
      description: "Meals and per diem",
      amount: 5000,
      currency: "KES",
      status: "pending",
      receipt: false,
    },
    {
      id: "EXP-004",
      date: "2025-09-17",
      category: "other",
      description: "Ground transportation",
      amount: 3500,
      currency: "KES",
      status: "pending",
      receipt: true,
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    date: "",
    category: "travel",
    description: "",
    amount: "",
    currency: "KES",
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses
    .filter((exp) => exp.status === "approved")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses
    .filter((exp) => exp.status === "pending")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      travel: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      accommodation: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      meals: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleAddExpense = () => {
    if (newExpense.date && newExpense.description && newExpense.amount) {
      const expense = {
        id: `EXP-${String(expenses.length + 1).padStart(3, "0")}`,
        date: newExpense.date,
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        currency: newExpense.currency,
        status: "pending",
        receipt: false,
      };
      setExpenses([...expenses, expense]);
      setNewExpense({
        date: "",
        category: "travel",
        description: "",
        amount: "",
        currency: "KES",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <button className="text-primary hover:text-primary-hover mb-2">
            ← Back to Audit
          </button>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Audit Expense Tracking
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Track and manage expenses for audit A-2025-142
          </p>
        </div>

        {/* Expense Summary */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <WidgetCard title="Total Expenses">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-dark dark:text-white">
                {totalExpenses.toLocaleString()} KES
              </p>
            </div>
          </WidgetCard>

          <WidgetCard title="Approved Expenses">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Approved
              </p>
              <p className="text-3xl font-bold text-green-600">
                {approvedExpenses.toLocaleString()} KES
              </p>
            </div>
          </WidgetCard>

          <WidgetCard title="Pending Approval">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Pending Approval
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingExpenses.toLocaleString()} KES
              </p>
            </div>
          </WidgetCard>
        </div>

        {/* Add New Expense */}
        <WidgetCard title="Add New Expense">
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="travel">Travel</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="meals">Meals & Per Diem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  placeholder="e.g., Flight ticket, Hotel stay"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <select
                  value={newExpense.currency}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, currency: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddExpense}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Add Expense
            </button>
          </div>
        </WidgetCard>

        {/* Expenses List */}
        <WidgetCard title={`Expenses (${expenses.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Receipt</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-3">{expense.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">{expense.description}</td>
                    <td className="px-4 py-3 font-medium">
                      {expense.amount.toLocaleString()} {expense.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          expense.status
                        )}`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {expense.receipt ? (
                        <span className="text-green-600">✓ Attached</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:text-primary-hover text-sm font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WidgetCard>

        {/* Expense Breakdown */}
        <WidgetCard title="Expense Breakdown by Category">
          <div className="space-y-3">
            {["travel", "accommodation", "meals", "other"].map((category) => {
              const categoryTotal = expenses
                .filter((exp) => exp.category === category)
                .reduce((sum, exp) => sum + exp.amount, 0);
              const percentage = (categoryTotal / totalExpenses) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize font-medium">
                      {category}
                    </span>
                    <span className="text-sm font-medium">
                      {categoryTotal.toLocaleString()} KES ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </WidgetCard>

        {/* Reimbursement Info */}
        <WidgetCard title="Reimbursement">
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Approved expenses will be automatically synced to Zoho Books for reimbursement processing.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Reimbursement Status: Pending Approval
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                Once all expenses are approved, reimbursement will be processed within 5 business days.
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
            Submit for Approval
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Export to Excel
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900">
            Sync to Zoho Books
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

