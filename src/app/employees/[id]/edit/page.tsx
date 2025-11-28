"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { EmployeeForm } from "@/components/Employees/employee-form";
import { Employee } from "@/types/audit";
import { employeeService } from "@/services/employee.service";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee data on mount
  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setIsFetching(true);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = await employeeService.getEmployee(id);
        setEmployee(data);
      } catch (err) {
        console.error("Error loading employee:", err);
        setError(err instanceof Error ? err.message : "Failed to load employee");
      } finally {
        setIsFetching(false);
      }
    };

    loadEmployee();
  }, [params.id]);

  const handleSubmit = async (data: Employee) => {
    if (!employee) return;

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

      console.log("Updating employee with data:", cleanedData);

      const id = String(employee.id);
      await employeeService.updateEmployee(id, cleanedData);
      console.log("Employee updated:", cleanedData);

      // Redirect to employee detail page
      router.push(`/employees/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update employee");
      console.error("Error updating employee:", err);
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
            Edit Employee
          </h1>
          <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
            Update employee information and settings
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

        {/* Loading State */}
        {isFetching ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading employee data...
            </p>
          </div>
        ) : employee ? (
          <EmployeeForm employee={employee} onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Employee not found
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

