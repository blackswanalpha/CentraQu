"use client";

import { useState } from "react";
import { Task, TaskStatus, TaskPriority, TaskCategory, TaskProgress, RecurrenceType, Subtask } from "@/types/audit";
import { FormInput } from "@/components/Dashboard/form-input";
import { Button } from "@/components/Dashboard/button";
import { useForm } from "@/hooks/useForm";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Task) => Promise<void>;
  isLoading?: boolean;
}

const TASK_STATUSES: TaskStatus[] = ["pending", "in-progress", "completed", "cancelled", "on-hold"];
const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];
const TASK_CATEGORIES: TaskCategory[] = [
  "invoicing",
  "sales",
  "audit-scheduling",
  "compliance",
  "hr",
  "reporting",
  "vendor-payments",
  "approvals",
  "follow-ups",
  "other",
];
const TASK_PROGRESS: TaskProgress[] = ["not-started", "in-progress", "blocked", "completed"];
const RECURRENCE_TYPES: RecurrenceType[] = ["none", "daily", "weekly", "monthly", "yearly"];

export function TaskForm({ task, onSubmit, isLoading = false }: TaskFormProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [enableReminders, setEnableReminders] = useState(false);

  const initialValues: Task = task || {
    id: "",
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    category: "other",
    progress: "not-started",
    assignedTo: "",
    assignedToName: "",
    createdBy: "current-user",
    createdByName: "You",
    dueDate: new Date(),
    dueTime: "17:00",
    createdAt: new Date(),
    updatedAt: new Date(),
    recurrence: "none",
    recurrenceInterval: 1,
    recurrenceDays: [],
    monthlyPattern: "day-of-month",
    subtasks: [],
  };

  const validate = (values: Task) => {
    const errors: Partial<Record<keyof Task, string>> = {};

    if (!values.title?.trim()) errors.title = "Task title is required";
    if (values.title && values.title.length < 3) errors.title = "Title must be at least 3 characters";
    if (!values.category) errors.category = "Category is required";
    if (!values.priority) errors.priority = "Priority is required";
    if (!values.dueDate) errors.dueDate = "Due date is required";

    return errors;
  };

  const form = useForm({
    initialValues,
    onSubmit: async (values) => {
      await onSubmit({
        ...values,
        subtasks,
        updatedAt: new Date(),
      });
    },
    validate,
  });

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: `subtask-${Date.now()}`,
          title: newSubtask,
          completed: false,
        },
      ]);
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      )
    );
  };

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Basic Information
        </h2>

        <div className="space-y-4">
          <FormInput
            label="Task Title"
            placeholder="Enter task title"
            value={form.values.title}
            onChange={(e) => form.handleChange("title", e.target.value)}
            onBlur={() => form.handleBlur("title")}
            error={form.touched.title ? form.errors.title : undefined}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={form.values.description || ""}
              onChange={(e) => form.handleChange("description", e.target.value)}
              placeholder="Enter task description and action items..."
              rows={4}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.values.category}
                onChange={(e) => form.handleChange("category", e.target.value as TaskCategory)}
                onBlur={() => form.handleBlur("category")}
                className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
              {form.touched.category && form.errors.category && (
                <p className="text-xs text-red-500 mt-1">{form.errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={form.values.priority}
                onChange={(e) => form.handleChange("priority", e.target.value as TaskPriority)}
                onBlur={() => form.handleBlur("priority")}
                className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
              {form.touched.priority && form.errors.priority && (
                <p className="text-xs text-red-500 mt-1">{form.errors.priority}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment & Timing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Assignment & Timing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Assigned To"
            placeholder="Enter assignee name or team"
            value={form.values.assignedToName || ""}
            onChange={(e) => form.handleChange("assignedToName", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={form.values.status}
              onChange={(e) => form.handleChange("status", e.target.value as TaskStatus)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.values.dueDate.toISOString().split("T")[0]}
              onChange={(e) => form.handleChange("dueDate", new Date(e.target.value))}
              onBlur={() => form.handleBlur("dueDate")}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
            {form.touched.dueDate && form.errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{form.errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Time
            </label>
            <input
              type="time"
              value={form.values.dueTime || "17:00"}
              onChange={(e) => form.handleChange("dueTime", e.target.value)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Related Entities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Related Entities (Optional)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Related Audit ID"
            placeholder="e.g., A-2025-145"
            value={form.values.relatedAuditId || ""}
            onChange={(e) => form.handleChange("relatedAuditId", e.target.value)}
          />

          <FormInput
            label="Related Client ID"
            placeholder="e.g., ABC-Corp"
            value={form.values.relatedClientId || ""}
            onChange={(e) => form.handleChange("relatedClientId", e.target.value)}
          />

          <FormInput
            label="Related Contract ID"
            placeholder="e.g., CTR-2025-047"
            value={form.values.relatedContractId || ""}
            onChange={(e) => form.handleChange("relatedContractId", e.target.value)}
          />

          <FormInput
            label="Related Opportunity ID"
            placeholder="e.g., OPP-00345"
            value={form.values.relatedOpportunityId || ""}
            onChange={(e) => form.handleChange("relatedOpportunityId", e.target.value)}
          />
        </div>
      </div>

      {/* Recurrence Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Recurrence Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recurrence Pattern
            </label>
            <select
              value={form.values.recurrence}
              onChange={(e) => form.handleChange("recurrence", e.target.value as RecurrenceType)}
              className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            >
              {RECURRENCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "none" ? "One-time task" : `Repeat ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </option>
              ))}
            </select>
          </div>

          {form.values.recurrence !== "none" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Repeat Every
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={form.values.recurrenceInterval || 1}
                      onChange={(e) => form.handleChange("recurrenceInterval", parseInt(e.target.value))}
                      className="w-20 rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {form.values.recurrence === "daily" && "day(s)"}
                      {form.values.recurrence === "weekly" && "week(s)"}
                      {form.values.recurrence === "monthly" && "month(s)"}
                      {form.values.recurrence === "yearly" && "year(s)"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Recurrence
                  </label>
                  <input
                    type="date"
                    value={form.values.recurrenceEndDate ? form.values.recurrenceEndDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => form.handleChange("recurrenceEndDate", e.target.value ? new Date(e.target.value) : undefined)}
                    min={form.values.dueDate.toISOString().split("T")[0]}
                    className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to continue indefinitely</p>
                </div>
              </div>

              {form.values.recurrence === "weekly" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Repeat on Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                      <label key={day} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.values.recurrenceDays?.includes(index) || false}
                          onChange={(e) => {
                            const days = form.values.recurrenceDays || [];
                            if (e.target.checked) {
                              form.handleChange("recurrenceDays", [...days, index]);
                            } else {
                              form.handleChange("recurrenceDays", days.filter(d => d !== index));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {form.values.recurrence === "monthly" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Pattern
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="monthlyPattern"
                        value="day-of-month"
                        checked={form.values.monthlyPattern === "day-of-month" || !form.values.monthlyPattern}
                        onChange={(e) => form.handleChange("monthlyPattern", e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">On day {form.values.dueDate.getDate()} of every month</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="monthlyPattern"
                        value="day-of-week"
                        checked={form.values.monthlyPattern === "day-of-week"}
                        onChange={(e) => form.handleChange("monthlyPattern", e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">On the same weekday of every month</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  📅 Recurrence Preview
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  {form.values.recurrence === "daily" && `This task will repeat every ${form.values.recurrenceInterval || 1} day(s)`}
                  {form.values.recurrence === "weekly" && `This task will repeat every ${form.values.recurrenceInterval || 1} week(s)`}
                  {form.values.recurrence === "monthly" && `This task will repeat every ${form.values.recurrenceInterval || 1} month(s)`}
                  {form.values.recurrence === "yearly" && `This task will repeat every ${form.values.recurrenceInterval || 1} year(s)`}
                  {form.values.recurrenceEndDate && ` until ${form.values.recurrenceEndDate.toLocaleDateString()}`}
                  {!form.values.recurrenceEndDate && " indefinitely"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Reminders
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableReminders}
              onChange={(e) => setEnableReminders(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Enable task reminders</span>
          </label>

          {enableReminders && (
            <div className="space-y-3 pl-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reminder Time
                  </label>
                  <select className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                    <option value="240">4 hours before</option>
                    <option value="1440">1 day before</option>
                    <option value="2880">2 days before</option>
                    <option value="10080">1 week before</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reminder Method
                  </label>
                  <select className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <option value="email">Email</option>
                    <option value="in-app">In-app notification</option>
                    <option value="sms">SMS</option>
                    <option value="mobile">Mobile push</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Send reminder to task assignee</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Send reminder to task creator</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtasks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-dark dark:text-white mb-4">
          Subtasks
        </h2>

        <div className="space-y-3">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleSubtask(subtask.id)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span
                className={`flex-1 ${
                  subtask.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-dark dark:text-white"
                }`}
              >
                {subtask.title}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSubtask(subtask.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask())}
              placeholder="Add a subtask..."
              className="flex-1 rounded-lg border-2 border-stroke px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
            <Button type="button" variant="secondary" onClick={handleAddSubtask}>
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading || form.isSubmitting}>
          {isLoading || form.isSubmitting ? "Creating..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}

