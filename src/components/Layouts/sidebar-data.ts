import * as Icons from "./sidebar-icons";

export const NAV_DATA = [
  // Main Navigation
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: Icons.DashboardIcon,
        items: [
          {
            title: "Overview",
            url: "/dashboard",
          },
          {
            title: "Financial",
            url: "/dashboard/financial",
          },
          {
            title: "Sales Pipeline",
            url: "/dashboard/sales",
          },
          {
            title: "Auditors",
            url: "/dashboard/auditors",
          },
          {
            title: "Compliance",
            url: "/dashboard/compliance",
          },
          {
            title: "Clients",
            url: "/dashboard/clients",
          },
          {
            title: "Operations",
            url: "/dashboard/operations",
          },
          {
            title: "Activity",
            url: "/dashboard/activity",
          },
          {
            title: "Goals & KPIs",
            url: "/dashboard/goals",
          },
        ],
      },
      {
        title: "Scheduler",
        icon: Icons.SchedulerIcon,
        items: [
          {
            title: "Scheduler",
            url: "/scheduler",
          },
        ],
      },
      {
        title: "Job Pipeline",
        icon: Icons.ReportsIcon,
        items: [
          {
            title: "Job Pipeline",
            url: "/job-pipeline",
          },
        ],
      },
    ],
  },
  {
    label: "SCHEDULES",
    items: [
      {
        title: "Workflows",
        icon: Icons.WorkflowIcon,
        items: [
          {
            title: "All Workflows",
            url: "/workflows",
          },
          {
            title: "New Workflow",
            url: "/workflows/new",
          },
          {
            title: "Templates",
            url: "/workflows/templates",
          },
        ],
      },
      {
        title: "Checklists",
        icon: Icons.ChecklistIcon,
        items: [
          {
            title: "All Checklists",
            url: "/checklists",
          },
          {
            title: "New Checklist",
            url: "/checklists/new",
          },
          {
            title: "Templates",
            url: "/checklists/templates",
          },
        ],
      },
      {
        title: "Audit Activities",
        icon: Icons.AuditIcon,
        items: [
          {
            title: "All Activities",
            url: "/audit-activities",
          },
          {
            title: "New Activity",
            url: "/audit-activities/new",
          },
        ],
      },
      {
        title: "Tasks",
        icon: Icons.TasksIcon,
        items: [
          {
            title: "Dashboard",
            url: "/tasks",
          },
          {
            title: "All Tasks",
            url: "/tasks/list",
          },
          {
            title: "Calendar",
            url: "/tasks/calendar",
          },
          {
            title: "Templates",
            url: "/tasks/templates",
          },
          {
            title: "Analytics",
            url: "/tasks/analytics",
          },
        ],
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        title: "Clients",
        icon: Icons.ClientsIcon,
        items: [
          {
            title: "All Clients",
            url: "/clients",
          },
          {
            title: "Add Client",
            url: "/clients/new",
          },
          {
            title: "Intake Links",
            url: "/clients/intake-links",
          },
          {
            title: "Intake Submissions",
            url: "/clients/intake-submissions",
          },
        ],
      },
      {
        title: "Business Development",
        icon: Icons.BusinessIcon,
        items: [
          {
            title: "Opportunities",
            url: "/business-development/opportunities",
          },
          {
            title: "New Opportunity",
            url: "/business-development/opportunities/new",
          },
          {
            title: "Contracts",
            url: "/business-development/contracts",
          },
        ],
      },
      {
        title: "Audits",
        icon: Icons.AuditIcon,
        items: [
          {
            title: "All Audits",
            url: "/dashboard/audits",
          },
          {
            title: "Certification Issuance",
            url: "/dashboard/audits/certifications",
          },
          {
            title: "Calendar",
            url: "/dashboard/audits/calendar",
          },
          {
            title: "Schedule New",
            url: "/dashboard/audits/new",
          },
          {
            title: "Findings",
            url: "/dashboard/audits/findings",
          },
          {
            title: "Non-Conformances",
            url: "/dashboard/audits/non-conformances",
          },
          {
            title: "Revenue",
            url: "/dashboard/audits/revenue",
          },
          {
            title: "Analytics",
            url: "/dashboard/audits/analytics",
          },
          {
            title: "Audit Tracker",
            url: "/dashboard/audits/surveillance",
          },
          {
            title: "Templates",
            url: "/dashboard/audits/templates",
          },
          {
            title: "Quality Review",
            url: "/dashboard/audits/quality-review",
          },
        ],
      },
      {
        title: "Certifications",
        icon: Icons.AuditIcon,
        items: [
          {
            title: "All Certifications",
            url: "/certifications",
          },
          {
            title: "Standards",
            url: "/certifications/standards",
          },
          {
            title: "Add Certification",
            url: "/certifications/new",
          },
        ],
      },
      {
        title: "Employees",
        icon: Icons.EmployeeIcon,
        items: [
          {
            title: "All Employees",
            url: "/employees",
          },
          {
            title: "Add Employee",
            url: "/employees/new",
          },
          {
            title: "User Management",
            url: "/employees/user-management",
          },
        ],
      },
      {
        title: "Payroll",
        icon: Icons.PayrollIcon,
        items: [
          {
            title: "All Payroll",
            url: "/payroll",
          },
          {
            title: "Create Payroll",
            url: "/payroll/new",
          },
        ],
      },
      {
        title: "Documents",
        icon: Icons.DocumentIcon,
        items: [
          {
            title: "Library",
            url: "/documents",
          },
          {
            title: "Upload",
            url: "/documents/upload",
          },
          {
            title: "Search",
            url: "/documents/search",
          },
          {
            title: "Invoices",
            url: "/documents/invoices",
          },
        ],
      },
      {
        title: "Reports",
        icon: Icons.ReportsIcon,
        items: [
          {
            title: "Audit Reports",
            url: "/reports/audits",
          },
          {
            title: "Financial Reports",
            url: "/reports/financial",
          },
        ],
      },
    ],
  },
  {
    label: "TOOLS",
    items: [
      {
        title: "Currency Converter",
        icon: Icons.CurrencyIcon,
        items: [
          {
            title: "Converter",
            url: "/currency-converter",
          },
        ],
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        title: "Settings",
        icon: Icons.SettingsIcon,
        items: [
          {
            title: "Company",
            url: "/settings/company",
          },
          {
            title: "Team",
            url: "/settings/team",
          },
          {
            title: "Integrations",
            url: "/settings/integrations",
          },
          {
            title: "Reminders",
            url: "/settings/reminders",
          },
        ],
      },
    ],
  },
];

