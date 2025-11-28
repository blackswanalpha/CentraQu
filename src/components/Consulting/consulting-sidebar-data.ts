import * as Icons from "../Layouts/sidebar-icons";

export const CONSULTING_NAV_DATA = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: Icons.DashboardIcon,
        items: [
          {
            title: "Overview",
            url: "/consulting/dashboard",
          },
          {
            title: "Portfolio",
            url: "/consulting/projects/portfolio",
          },
          {
            title: "Analytics",
            url: "/consulting/analytics",
          },
          {
            title: "Reports",
            url: "/consulting/reports",
          },
        ],
      },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      {
        title: "Performance",
        icon: Icons.DashboardIcon,
        items: [
          {
            title: "Consultant Performance",
            url: "/consulting/dashboard/consultants",
          },
          {
            title: "Client Health",
            url: "/consulting/dashboard/clients",
          },
          {
            title: "Delivery Excellence",
            url: "/consulting/dashboard/delivery",
          },
        ],
      },
      {
        title: "Financial",
        icon: Icons.ReportsIcon,
        items: [
          {
            title: "Financial Performance",
            url: "/consulting/dashboard/financial",
          },
        ],
      },
      {
        title: "Business Development",
        icon: Icons.ClientsIcon,
        items: [
          {
            title: "Pipeline Dashboard",
            url: "/consulting/dashboard/business-development",
          },
          {
            title: "Opportunities",
            url: "/consulting/business-development/opportunities",
          },
          {
            title: "New Opportunity",
            url: "/consulting/business-development/opportunities/new",
          },
          {
            title: "Proposal Generator",
            url: "/consulting/business-development/proposals/new",
          },
          {
            title: "RFP Management",
            url: "/consulting/business-development/rfps",
          },
          {
            title: "Sales Analytics",
            url: "/consulting/business-development/analytics",
          },
        ],
      },
    ],
  },
  {
    label: "PROJECT MANAGEMENT",
    items: [
      {
        title: "Projects",
        icon: Icons.AuditIcon,
        items: [
          {
            title: "All Projects",
            url: "/consulting/projects",
          },
          {
            title: "Portfolio View",
            url: "/consulting/projects/portfolio",
          },
          {
            title: "Calendar",
            url: "/consulting/projects/calendar",
          },
          {
            title: "New Project",
            url: "/consulting/projects/new",
          },
          {
            title: "Templates",
            url: "/consulting/projects/templates",
          },
        ],
      },
      {
        title: "Clients",
        icon: Icons.ClientsIcon,
        items: [
          {
            title: "All Clients",
            url: "/consulting/clients",
          },
          {
            title: "Add Client",
            url: "/consulting/clients/new",
          },
          {
            title: "Intake Links",
            url: "/consulting/clients/intake-links",
          },
          {
            title: "Intake Submissions",
            url: "/consulting/clients/intake-submissions",
          },
        ],
      },
      {
        title: "Resources",
        icon: Icons.ClientsIcon,
        items: [
          {
            title: "Team",
            url: "/consulting/resources/team",
          },
          {
            title: "Allocation",
            url: "/consulting/resources/allocation",
          },
          {
            title: "Capacity Planning",
            url: "/consulting/resources/capacity",
          },
          {
            title: "Skills Matrix",
            url: "/consulting/resources/skills",
          },
        ],
      },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      {
        title: "Tasks",
        icon: Icons.AuditIcon,
        items: [
          {
            title: "All Tasks",
            url: "/consulting/tasks",
          },
          {
            title: "My Tasks",
            url: "/consulting/tasks/my-tasks",
          },
          {
            title: "Calendar",
            url: "/consulting/tasks/calendar",
          },
        ],
      },
      {
        title: "Documents",
        icon: Icons.ReportsIcon,
        items: [
          {
            title: "All Documents",
            url: "/consulting/documents",
          },
          {
            title: "Upload",
            url: "/consulting/documents/upload",
          },
          {
            title: "Search",
            url: "/consulting/documents/search",
          },
        ],
      },
      {
        title: "Time Tracking",
        icon: Icons.DashboardIcon,
        items: [
          {
            title: "Timesheets",
            url: "/consulting/time/timesheets",
          },
          {
            title: "Approvals",
            url: "/consulting/time/approvals",
          },
          {
            title: "Reports",
            url: "/consulting/time/reports",
          },
        ],
      },
    ],
  },
  {
    label: "FINANCIAL",
    items: [
      {
        title: "Revenue",
        icon: Icons.DashboardIcon,
        items: [
          {
            title: "Overview",
            url: "/consulting/revenue",
          },
          {
            title: "Invoicing",
            url: "/consulting/revenue/invoicing",
          },
          {
            title: "Collections",
            url: "/consulting/revenue/collections",
          },
        ],
      },
      {
        title: "Expenses",
        icon: Icons.ReportsIcon,
        items: [
          {
            title: "All Expenses",
            url: "/consulting/expenses",
          },
          {
            title: "Submit Expense",
            url: "/consulting/expenses/new",
          },
          {
            title: "Approvals",
            url: "/consulting/expenses/approvals",
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
            title: "General",
            url: "/consulting/settings",
          },
          {
            title: "Team",
            url: "/consulting/settings/team",
          },
          {
            title: "Integrations",
            url: "/consulting/settings/integrations",
          },
          {
            title: "Notifications",
            url: "/consulting/settings/notifications",
          },
        ],
      },
    ],
  },
];

