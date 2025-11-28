"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { EmployeeCard } from "@/components/Employees/employee-card";
import { DeleteEmployeeModal } from "@/components/Employees/delete-employee-modal";
import { Button } from "@/components/Dashboard/button";
import { FormInput } from "@/components/Dashboard/form-input";
import { Employee, EmployeeStatus, EmployeeRole } from "@/types/audit";
import { employeeService } from "@/services/employee.service";
import Link from "next/link";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | "all">("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
  }>({ isOpen: false, employee: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees on mount
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading employees:", err);
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || employee.status === statusFilter;

      const matchesRole =
        roleFilter === "all" || employee.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [employees, searchTerm, statusFilter, roleFilter]);

  // Handle delete
  const handleDeleteClick = (employeeId: string | number) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      setDeleteModal({ isOpen: true, employee });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.employee) return;

    setIsDeleting(true);
    try {
      await employeeService.deleteEmployee(String(deleteModal.employee.id));
      // Reload employees after successful delete
      await loadEmployees();
      setDeleteModal({ isOpen: false, employee: null });
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(error instanceof Error ? error.message : "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    onLeave: employees.filter((e) => e.status === "on-leave").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Employees
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Manage and monitor all employee accounts
            </p>
          </div>
          <Link href="/employees/new">
            <Button variant="primary">+ Add Employee</Button>
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
            <p className="text-2xl font-bold text-dark dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-success mt-1">{stats.active}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">On Leave</p>
            <p className="text-2xl font-bold text-accent mt-1">{stats.onLeave}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
            <p className="text-2xl font-bold text-error mt-1">{stats.inactive}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | "all")}
              className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as EmployeeRole | "all")}
              className="rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Roles</option>
              <option value="lead-auditor">Lead Auditor</option>
              <option value="auditor">Auditor</option>
              <option value="technical-expert">Technical Expert</option>
              <option value="trainee">Trainee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Employees Grid */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading employees...
            </p>
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {employees.length === 0
                ? "No employees found. Click 'Add Employee' to create one."
                : "No employees found matching your criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteEmployeeModal
        isOpen={deleteModal.isOpen}
        employee={deleteModal.employee}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, employee: null })}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

