"use client";

import { Employee, EmployeeStatus, EmployeeRole, CertificationStandard } from "@/types/audit";
import { FormInput } from "@/components/Dashboard/form-input";
import { Button } from "@/components/Dashboard/button";
import { useForm } from "@/hooks/useForm";
import { validateEmail } from "@/lib/utils";

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: Employee) => Promise<void>;
  isLoading?: boolean;
}

const EMPLOYEE_ROLES: EmployeeRole[] = [
  "lead-auditor",
  "auditor",
  "technical-expert",
  "trainee",
  "manager",
  "admin",
];

const EMPLOYEE_STATUSES: EmployeeStatus[] = ["active", "inactive", "on-leave", "terminated", "resigned"];

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
  { value: "CONSULTANT", label: "Consultant" },
];

const GENDER_OPTIONS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" },
];

const CERTIFICATION_STANDARDS: CertificationStandard[] = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 27001:2013",
  "ISO 22000:2018",
];

const DEPARTMENTS = [
  "Audit Operations",
  "Quality Assurance",
  "Business Development",
  "Administration",
  "Finance",
  "Human Resources",
  "Engineering",
  "Operations",
];

const LANGUAGES = [
  "English",
  "Swahili",
  "French",
  "Spanish",
  "German",
  "Arabic",
  "Chinese",
];

export function EmployeeForm({ employee, onSubmit, isLoading = false }: EmployeeFormProps) {
  const initialValues: Employee = employee || {
    id: "",
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    role: "auditor",
    department: "",
    status: "active",
    hireDate: new Date().toISOString().split('T')[0], // Store as YYYY-MM-DD string
    certifications: [],
    experience: 0,
    languages: [],
    utilization: 0,
    satisfaction: 0,
    dateOfBirth: undefined,
    gender: "",
    nationalId: "",
    passportNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    address: "",
    addressLine2: "",
    city: "",
    county: "",
    zipCode: "",
    employmentType: "FULL_TIME",
    baseSalary: undefined,
    currency: "KES",
    work_hours_per_week: 40,
    commissionEnabled: false,
    commissionRate: "0.00",
  };

  const validate = (values: Employee) => {
    const errors: Partial<Record<keyof Employee, string>> = {};

    if (!values.firstName?.trim()) errors.firstName = "First name is required";
    if (!values.lastName?.trim()) errors.lastName = "Last name is required";
    if (!values.email?.trim()) errors.email = "Email is required";
    else if (!validateEmail(values.email)) errors.email = "Invalid email format";

    return errors;
  };

  const form = useForm({
    initialValues,
    onSubmit,
    validate,
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="First Name"
            placeholder="Enter first name"
            value={form.values.firstName}
            onChange={(e) => form.handleChange("firstName", e.target.value)}
            onBlur={() => form.handleBlur("firstName")}
            error={form.touched.firstName ? form.errors.firstName : undefined}
            required
          />

          <FormInput
            label="Middle Name"
            placeholder="Enter middle name"
            value={form.values.middleName || ""}
            onChange={(e) => form.handleChange("middleName", e.target.value)}
          />

          <FormInput
            label="Last Name"
            placeholder="Enter last name"
            value={form.values.lastName}
            onChange={(e) => form.handleChange("lastName", e.target.value)}
            onBlur={() => form.handleBlur("lastName")}
            error={form.touched.lastName ? form.errors.lastName : undefined}
            required
          />

          <FormInput
            label="Date of Birth"
            type="date"
            value={form.values.dateOfBirth ? (typeof form.values.dateOfBirth === 'string' ? form.values.dateOfBirth.split('T')[0] : new Date(form.values.dateOfBirth).toISOString().split('T')[0]) : ""}
            onChange={(e) => form.handleChange("dateOfBirth", e.target.value || undefined)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Gender
            </label>
            <select
              value={form.values.gender || ""}
              onChange={(e) => form.handleChange("gender", e.target.value)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="National ID"
            placeholder="Enter national ID"
            value={form.values.nationalId || ""}
            onChange={(e) => form.handleChange("nationalId", e.target.value)}
          />

          <FormInput
            label="Passport Number"
            placeholder="Enter passport number"
            value={form.values.passportNumber || ""}
            onChange={(e) => form.handleChange("passportNumber", e.target.value)}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={form.values.email}
            onChange={(e) => form.handleChange("email", e.target.value)}
            onBlur={() => form.handleBlur("email")}
            error={form.touched.email ? form.errors.email : undefined}
            required
          />

          <FormInput
            label="Phone"
            type="tel"
            placeholder="Enter phone number"
            value={form.values.phone || ""}
            onChange={(e) => form.handleChange("phone", e.target.value)}
          />

          <FormInput
            label="Emergency Contact Name"
            placeholder="Enter emergency contact name"
            value={form.values.emergencyContact || ""}
            onChange={(e) => form.handleChange("emergencyContact", e.target.value)}
          />

          <FormInput
            label="Emergency Contact Phone"
            type="tel"
            placeholder="Enter emergency contact phone"
            value={form.values.emergencyPhone || ""}
            onChange={(e) => form.handleChange("emergencyPhone", e.target.value)}
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Address Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Address Line 1"
            placeholder="Enter street address"
            value={form.values.address || ""}
            onChange={(e) => form.handleChange("address", e.target.value)}
          />

          <FormInput
            label="Address Line 2"
            placeholder="Enter apartment, suite, etc."
            value={form.values.addressLine2 || ""}
            onChange={(e) => form.handleChange("addressLine2", e.target.value)}
          />

          <FormInput
            label="City"
            placeholder="Enter city"
            value={form.values.city || ""}
            onChange={(e) => form.handleChange("city", e.target.value)}
          />

          <FormInput
            label="County/State"
            placeholder="Enter county or state"
            value={form.values.county || ""}
            onChange={(e) => form.handleChange("county", e.target.value)}
          />

          <FormInput
            label="Postal Code"
            placeholder="Enter postal code"
            value={form.values.zipCode || ""}
            onChange={(e) => form.handleChange("zipCode", e.target.value)}
          />
        </div>
      </div>

      {/* Employment Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Employment Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Role
            </label>
            <select
              value={form.values.role || ""}
              onChange={(e) => form.handleChange("role", e.target.value as EmployeeRole)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select role</option>
              {EMPLOYEE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Department
            </label>
            <select
              value={form.values.department || ""}
              onChange={(e) => form.handleChange("department", e.target.value)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Employment Type
            </label>
            <select
              value={form.values.employmentType || "FULL_TIME"}
              onChange={(e) => form.handleChange("employmentType", e.target.value)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Status
            </label>
            <select
              value={form.values.status}
              onChange={(e) => form.handleChange("status", e.target.value as EmployeeStatus)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {EMPLOYEE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Hire Date"
            type="date"
            value={form.values.hireDate ? (typeof form.values.hireDate === 'string' ? form.values.hireDate.split('T')[0] : new Date(form.values.hireDate).toISOString().split('T')[0]) : ""}
            onChange={(e) => form.handleChange("hireDate", e.target.value || undefined)}
          />

          <FormInput
            label="Work Hours Per Week"
            type="number"
            min="0"
            max="168"
            value={form.values.work_hours_per_week || 40}
            onChange={(e) => form.handleChange("work_hours_per_week", parseInt(e.target.value) || 40)}
          />
        </div>
      </div>

      {/* Compensation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Compensation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Base Salary"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter base salary"
            value={form.values.baseSalary || ""}
            onChange={(e) => form.handleChange("baseSalary", e.target.value ? parseFloat(e.target.value) : undefined)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Currency
            </label>
            <select
              value={form.values.currency || "KES"}
              onChange={(e) => form.handleChange("currency", e.target.value)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-8">
            <input
              type="checkbox"
              id="commissionEnabled"
              checked={form.values.commissionEnabled || false}
              onChange={(e) => form.handleChange("commissionEnabled", e.target.checked)}
              className="rounded"
            />
            <label htmlFor="commissionEnabled" className="text-sm font-medium text-dark dark:text-white">
              Commission Enabled
            </label>
          </div>

          {form.values.commissionEnabled && (
            <FormInput
              label="Commission Rate"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter commission rate"
              value={form.values.commissionRate || "0.00"}
              onChange={(e) => form.handleChange("commissionRate", e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
          Professional Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormInput
            label="Years of Experience"
            type="number"
            min="0"
            value={form.values.experience || 0}
            onChange={(e) => form.handleChange("experience", parseInt(e.target.value) || 0)}
          />

          <FormInput
            label="Utilization (%)"
            type="number"
            min="0"
            max="100"
            value={form.values.utilization || 0}
            onChange={(e) => form.handleChange("utilization", parseInt(e.target.value) || 0)}
          />

          <FormInput
            label="Satisfaction (0-5)"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.values.satisfaction || 0}
            onChange={(e) => form.handleChange("satisfaction", parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Certifications
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CERTIFICATION_STANDARDS.map((cert) => (
                <label key={cert} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.values.certifications?.includes(cert) || false}
                    onChange={(e) => {
                      const certs = form.values.certifications || [];
                      if (e.target.checked) {
                        form.handleChange("certifications", [...certs, cert]);
                      } else {
                        form.handleChange(
                          "certifications",
                          certs.filter((c) => c !== cert)
                        );
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Languages
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LANGUAGES.map((lang) => (
                <label key={lang} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.values.languages?.includes(lang) || false}
                    onChange={(e) => {
                      const langs = form.values.languages || [];
                      if (e.target.checked) {
                        form.handleChange("languages", [...langs, lang]);
                      } else {
                        form.handleChange(
                          "languages",
                          langs.filter((l) => l !== lang)
                        );
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{lang}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isLoading}>
          {employee ? "Update Employee" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
}

