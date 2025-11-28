"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layouts/dashboard-layout";
import { Button } from "@/components/Dashboard/button";

interface ReminderRule {
  id: string;
  name: string;
  trigger: string;
  recipients: string;
  channels: string[];
  enabled: boolean;
}

const MOCK_RULES: ReminderRule[] = [
  {
    id: "r1",
    name: "Invoice Creation Reminder",
    trigger: "2 days before scheduled invoice date",
    recipients: "Assigned Finance Team Member",
    channels: ["Email", "In-app", "Mobile Push"],
    enabled: true,
  },
  {
    id: "r2",
    name: "Payment Collection Reminder",
    trigger: "3 days before invoice due date",
    recipients: "Client + Account Manager",
    channels: ["Email"],
    enabled: true,
  },
  {
    id: "r3",
    name: "Overdue Invoice Alert",
    trigger: "1 day, 7 days, 14 days after due date",
    recipients: "Client + Finance Manager + Account Manager",
    channels: ["Email", "SMS"],
    enabled: true,
  },
];

function ReminderRuleCard({ rule, onEdit, onTest }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            {rule.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Trigger: {rule.trigger}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Recipients: {rule.recipients}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Channels: {rule.channels.join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rule.enabled}
              className="w-4 h-4 rounded border-gray-300 text-primary"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {rule.enabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(rule.id)}
          className="px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 transition"
        >
          EDIT
        </button>
        <button
          onClick={() => onTest(rule.id)}
          className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition"
        >
          TEST REMINDER
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 transition">
          DISABLE
        </button>
      </div>
    </div>
  );
}

export default function RemindersSettingsPage() {
  const [rules, setRules] = useState<ReminderRule[]>(MOCK_RULES);

  const handleEditRule = (ruleId: string) => {
    console.log("Editing rule:", ruleId);
  };

  const handleTestReminder = (ruleId: string) => {
    console.log("Testing reminder:", ruleId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-1 font-bold text-dark dark:text-white">
              Settings &gt; Automated Reminders
            </h1>
            <p className="mt-2 text-body-base text-gray-600 dark:text-gray-400">
              Configure system-wide reminder rules
            </p>
          </div>
          <Button variant="primary">+ Add New Rule</Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Configure automatic reminders for key business events. Reminders can
            be sent via email, SMS, mobile push notifications, or in-app alerts.
          </p>
        </div>

        {/* Invoice Reminders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark dark:text-white">
              INVOICE REMINDERS
            </h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ● Enabled
              </span>
            </label>
          </div>

          {rules
            .filter((r) => r.id.startsWith("r"))
            .map((rule) => (
              <ReminderRuleCard
                key={rule.id}
                rule={rule}
                onEdit={handleEditRule}
                onTest={handleTestReminder}
              />
            ))}
        </div>

        {/* Vendor Payment Reminders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark dark:text-white">
              VENDOR PAYMENT REMINDERS
            </h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ● Enabled
              </span>
            </label>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-4">
            <h3 className="text-lg font-bold text-dark dark:text-white mb-2">
              Payment Due Reminder
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Trigger: 5 days before payment due date
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Recipients: Finance Team + Approver
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Channels: Email, In-app, Mobile Push
            </p>
            <div className="flex gap-2">
              <Button variant="secondary">EDIT</Button>
              <Button variant="secondary">TEST REMINDER</Button>
              <Button variant="secondary">DISABLE</Button>
            </div>
          </div>
        </div>

        {/* License Compliance Reminders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark dark:text-white">
              LICENSE COMPLIANCE REMINDERS
            </h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ● Enabled
              </span>
            </label>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "60-Day License Expiry Notice",
                trigger: "60 days before license expires",
                priority: "Normal",
              },
              {
                name: "30-Day License Expiry Alert",
                trigger: "30 days before license expires",
                priority: "High",
              },
              {
                name: "14-Day Critical License Alert",
                trigger: "14 days before license expires",
                priority: "Critical",
              },
              {
                name: "7-Day Final License Warning",
                trigger: "7 days before license expires",
                priority: "Critical - Regulatory Risk",
              },
            ].map((rule, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-dark dark:text-white">
                    {rule.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                    {rule.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Trigger: {rule.trigger}
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary">EDIT</Button>
                  <Button variant="secondary">VIEW TEMPLATE</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
            REMINDER STATISTICS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This Month
              </p>
              <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                247
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                reminders sent
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Response Rate
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">89%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                average
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Response Time
              </p>
              <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                4.2h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                hours
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escalations
              </p>
              <p className="text-2xl font-bold text-dark dark:text-white mt-1">
                12
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                triggered
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary">VIEW DETAILED ANALYTICS</Button>
            <Button variant="secondary">DOWNLOAD REPORT</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

