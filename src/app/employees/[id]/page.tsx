"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { WidgetCard } from "@/components/Dashboard/widget-card";
import { Badge } from "@/components/Dashboard/badge";
import { Button } from "@/components/Dashboard/button";
import { Employee, EmployeeStatus } from "@/types/audit";
import { employeeService } from "@/services/employee.service";

const statusVariants: Record<EmployeeStatus, "success" | "warning" | "error" | "info" | "neutral"> = {
  active: "success",
  inactive: "neutral",
  "on-leave": "warning",
  terminated: "error",
  resigned: "neutral",
};

const statusLabels: Record<EmployeeStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  "on-leave": "On Leave",
  terminated: "Terminated",
  resigned: "Resigned",
};

const roleLabels: Record<string, string> = {
  "lead-auditor": "Lead Auditor",
  auditor: "Auditor",
  "technical-expert": "Technical Expert",
  trainee: "Trainee",
  manager: "Manager",
  admin: "Admin",
};

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee data on mount
  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setIsLoading(true);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = await employeeService.getEmployee(id);
        setEmployee(data);
      } catch (err) {
        console.error("Error loading employee:", err);
        setError(err instanceof Error ? err.message : "Failed to load employee");
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployee();
  }, [params.id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Loading employee data...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employee) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-red-600 dark:text-red-400">
            {error || "Employee not found"}
          </p>
          <Button
            variant="primary"
            onClick={() => router.push("/employees")}
            className="mt-4"
          >
            Back to Employees
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = employee.status as EmployeeStatus;
  const fullName = employee.fullName || `${employee.firstName} ${employee.lastName}`;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-heading-1 font-bold text-dark dark:text-white">
                {fullName}
              </h1>
              <Badge
                label={statusLabels[status]}
                variant={statusVariants[status]}
              />
            </div>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              {employee.role ? (roleLabels[employee.role] || employee.role) : 'N/A'} • {employee.department}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push(`/employees/${employee.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/employees")}
            >
              Back
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <WidgetCard title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Employee ID
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.employeeId || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Full Name
              </p>
              <p className="font-medium text-dark dark:text-white">
                {[employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(" ")}
              </p>
            </div>

            {employee.dateOfBirth && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date of Birth
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(employee.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}

            {employee.gender && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Gender
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {employee.gender === 'M' ? 'Male' : employee.gender === 'F' ? 'Female' : 'Other'}
                </p>
              </div>
            )}

            {employee.nationalId && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  National ID
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {employee.nationalId}
                </p>
              </div>
            )}

            {employee.passportNumber && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Passport Number
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {employee.passportNumber}
                </p>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Contact Information */}
        <WidgetCard title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Email
              </p>
              <a
                href={`mailto:${employee.email}`}
                className="text-primary hover:underline font-medium"
              >
                {employee.email}
              </a>
            </div>

            {employee.phone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${employee.phone}`}
                  className="text-primary hover:underline font-medium"
                >
                  {employee.phone}
                </a>
              </div>
            )}

            {employee.emergencyContact && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Emergency Contact Name
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {employee.emergencyContact}
                </p>
              </div>
            )}

            {employee.emergencyPhone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Emergency Contact Phone
                </p>
                <a
                  href={`tel:${employee.emergencyPhone}`}
                  className="text-primary hover:underline font-medium"
                >
                  {employee.emergencyPhone}
                </a>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Address Information */}
        {(employee.address || employee.city || employee.county || employee.zipCode) && (
          <WidgetCard title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employee.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Street Address
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {employee.address}
                    {employee.addressLine2 && <><br />{employee.addressLine2}</>}
                  </p>
                </div>
              )}

              {employee.city && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    City
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {employee.city}
                  </p>
                </div>
              )}

              {employee.county && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    County/State
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {employee.county}
                  </p>
                </div>
              )}

              {employee.zipCode && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Postal Code
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {employee.zipCode}
                  </p>
                </div>
              )}
            </div>
          </WidgetCard>
        )}

        {/* Employment Details */}
        <WidgetCard title="Employment Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Role
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.role ? (roleLabels[employee.role] || employee.role) : 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Department
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.department || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Employment Type
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.employmentType ? employee.employmentType.replace('_', ' ') : 'Full Time'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Status
              </p>
              <p className="font-medium text-dark dark:text-white">
                {statusLabels[status]}
              </p>
            </div>

            {employee.hireDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Hire Date
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {employee.terminationDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Termination Date
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(employee.terminationDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Work Hours Per Week
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.work_hours_per_week || 40} hours
              </p>
            </div>
          </div>
        </WidgetCard>

        {/* Compensation */}
        {(employee.baseSalary || employee.commissionEnabled) && (
          <WidgetCard title="Compensation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employee.baseSalary && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Base Salary
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {employee.currency || 'KES'} {employee.baseSalary.toLocaleString()}
                  </p>
                </div>
              )}

              {employee.commissionEnabled && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Commission Enabled
                    </p>
                    <p className="font-medium text-dark dark:text-white">
                      Yes
                    </p>
                  </div>

                  {employee.commissionRate && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Commission Rate
                      </p>
                      <p className="font-medium text-dark dark:text-white">
                        {employee.currency || 'KES'} {employee.commissionRate}
                      </p>
                    </div>
                  )}

                  {employee.auditCount !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Audits Completed
                      </p>
                      <p className="font-medium text-dark dark:text-white">
                        {employee.auditCount}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </WidgetCard>
        )}

        {/* Professional Information */}
        <WidgetCard title="Professional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Years of Experience
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.experience || "—"} years
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Utilization
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.utilization ? `${employee.utilization}%` : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Satisfaction Score
              </p>
              <p className="font-medium text-dark dark:text-white">
                {employee.satisfaction ? `${employee.satisfaction}/5` : "—"}
              </p>
            </div>

            {employee.languages && employee.languages.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Languages
                </p>
                <p className="font-medium text-dark dark:text-white">
                  {employee.languages.join(", ")}
                </p>
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Certifications */}
        {employee.certifications && employee.certifications.length > 0 && (
          <WidgetCard title="Certifications">
            <div className="flex flex-wrap gap-2">
              {employee.certifications.map((cert) => (
                <Badge key={cert} label={cert} variant="neutral" />
              ))}
            </div>
          </WidgetCard>
        )}

        {/* System Information */}
        {(employee.createdAt || employee.updatedAt) && (
          <WidgetCard title="System Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employee.createdAt && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Created At
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {new Date(employee.createdAt).toLocaleString()}
                  </p>
                </div>
              )}

              {employee.updatedAt && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Last Updated
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {new Date(employee.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </WidgetCard>
        )}
      </div>
    </DashboardLayout>
  );
}

