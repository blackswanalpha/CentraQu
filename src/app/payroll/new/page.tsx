"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreatePayrollPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Payroll) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, you would send this to your backend
      console.log("Creating payroll:", data);
      
      // Redirect to payroll list
      router.push("/payroll");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create payroll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">Create Payroll Record</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new payroll record for an employee
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
          employees={MOCK_EMPLOYEES}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}

