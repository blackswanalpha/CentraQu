"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { EmployeeForm } from "@/components/Employees/employee-form";
import { Employee } from "@/types/audit";
import { employeeService } from "@/services/employee.service";

export default function AddEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Employee) => {
    setIsLoading(true);
    setError(null);

    try {
      // Clean data: remove null/undefined values, empty strings, and system fields
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        // Skip system/read-only fields
        if (['id', 'employeeId', 'fullName', 'createdAt', 'updatedAt', 'skills'].includes(key)) {
          return acc;
        }

        // Keep the value if it's not null, undefined, or empty string
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        // Keep false boolean values
        else if (value === false) {
          acc[key] = value;
        }
        // Keep 0 numeric values
        else if (value === 0) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      console.log("Creating employee with data:", cleanedData);

      // Create employee via API
      const newEmployee = await employeeService.createEmployee(cleanedData);
      console.log("Employee created:", newEmployee);

      // Redirect to employees page
      router.push("/employees");
    } catch (err) {
      console.error("Error adding employee:", err);

      // Extract detailed error message
      let errorMsg = "Failed to add employee";
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMsg = JSON.stringify(err);
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-1 font-bold text-dark dark:text-white">
            Add New Employee
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Create a new employee account and set up their profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Form */}
        <EmployeeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}

