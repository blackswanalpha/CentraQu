"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { PayrollForm } from "@/components/Payroll/payroll-form";
import { Payroll, Employee } from "@/types/audit";

// Mock employees data
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phone: "(555) 123-4567",
    role: "lead-auditor",
    department: "Audit Operations",
    status: "active",
    hireDate: new Date("2020-01-15"),
    commissionEnabled: true,
    commissionRate: 150, // $150 per audit
    auditCount: 24,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "(555) 234-5678",
    role: "auditor",
    department: "Audit Operations",
    status: "active",
    hireDate: new Date("2021-06-20"),
    commissionEnabled: true,
    commissionRate: 100, // $100 per audit
    auditCount: 18,
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@company.com",
    phone: "(555) 345-6789",
    role: "technical-expert",
    department: "Quality Assurance",
    status: "active",
    hireDate: new Date("2019-03-10"),
    commissionEnabled: false,
  },
];

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

export default function EditPayrollPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const payroll = MOCK_PAYROLL[id];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!payroll) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Payroll record not found</p>
          <button
            onClick={() => router.push("/payroll")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Payroll
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (payroll.status !== "draft") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Only draft payroll records can be edited
          </p>
          <button
            onClick={() => router.push(`/payroll/${payroll.id}`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Payroll
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (data: Payroll) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, you would send this to your backend
      console.log("Updating payroll:", data);
      
      // Redirect to payroll detail
      router.push(`/payroll/${payroll.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payroll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">Edit Payroll Record</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update payroll information for {payroll.employeeName}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <p className="text-error">{error}</p>
          </div>
        )}

        {/* Form */}
        <PayrollForm
          payroll={payroll}
          employees={MOCK_EMPLOYEES}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}

