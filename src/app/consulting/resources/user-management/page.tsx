"use client";

import { ConsultingDashboardLayout } from "@/components/Consulting/consulting-dashboard-layout";
import * as Icons from "@/components/Layouts/sidebar-icons";

const users = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4SMNuhyU-GDsjpwdlpf6zccR3GmnZSh4sQJFrHEYANYbl5gpB8lv9rB6IF_qrxWmjeoOj9-cPn0TVo2D1RHrL_7NipndtuW-FiEz8TOqeQw2Vq-2S45IvASb3KKV52IO4P7AHBMPqEVj_9Ayd6iKraWJ13eXQoo0aM85UAqq2UrbgGv9cyjNmrtSATpVSnMr2v1TATa7cVdSeXIVL_Vc5ObOigFaBlMNUyK90doil5An6bYiXRhPazJbfKU22iMCrJ373lS8V-PUJ",
    role: "Admin",
    lastLogin: "2 days ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Alex Chen",
    email: "alex.c@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM4fmb5ccl_b-7BMYOUN2YgDvcUBdVx6pC0akksMrrMuN9dOmkpPp3DNrN34SgEiEjCkkVgBLAKwMw5Bz1RB6slBIXZWbhZZVPvwR3Q6-tvLCsKgDy0ogfLuL3l1U56neSTHGl47OeYt3UBYgs87QqC5IOYFWQRcgpcQtc04k1PhkOWokl0fg0w3n4O2M0NJv7ZNYTVFHQdmKxTwJ3E7XOyJ4eykKBE3zxTfzuEmvW0K0PSxXMrPqzroR3CB5g1Yk_M3RT_eU1EXuh",
    role: "Auditor",
    lastLogin: "Jan 5, 2024",
    status: "Active",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.g@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAHg7lO21INScX380TsY8W7qul5dwcj578UbNMizyobH_Re2Fshozc8OrKW_sYSO3_h7QwVStqDSVneWfekWzOdZ7NEa0GSqBrspzZMP5jULAeeoKL_rlNkJ8oy5mM4HPfAxV3d9wyso3hCAvOcj57-IyoZi9JoiN29kESj18Ihp-NXwQhg_h9XbPd6-EvslqC9jtVCMTy9kHW7U6E3pqAQ3B7oeT8xCz79MNKXQGUSZKJ8PVpon5PxT5vGw33QRrEmJuYrp88eU-l",
    role: "Manager",
    lastLogin: "Never",
    status: "Invited",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.k@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCueCP4i5JShPFNgkKgDkEBP_fGno2SU5tVkyHZZN4P_FQzU4uCcG2nq7xhua14OYjB_KRG9kJXlJepPMGl-DObwmHw4Y2cOtENWzYmErEI5Gd9T3y7XdXIbt_HPFM6l8Zy3G-Gfgs8kgwQML7UysOtQ1ODMd8wt301fhnVUwI-VI5IdUJLcN5y1fQs3qdrrSnO-SUsipMxP46xUI7Myvr1S_EWbvf5jHeouJIIXag9ee8Cq3k_sgGvBuE_9SMNdbx7sAG_v_NIbUV_",
    role: "Auditor",
    lastLogin: "1 month ago",
    status: "Deactivated",
  },
];

export default function UserManagementPage() {
  return (
    <ConsultingDashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* PageHeading */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
              User Management
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
              Create/manage users, roles and permissions.
            </p>
          </div>
          <button className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
            <Icons.PlusIcon className="w-5 h-5" />
            <span className="truncate">Invite User</span>
          </button>
        </div>
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          {/* Chips */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-md bg-white dark:bg-slate-700 px-4 text-primary dark:text-white text-sm font-medium leading-normal shadow-sm">
              All
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-md px-4 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 text-sm font-medium leading-normal">
              Active
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-md px-4 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 text-sm font-medium leading-normal">
              Deactivated
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-md px-4 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 text-sm font-medium leading-normal">
              Invited
            </button>
          </div>
          {/* SearchBar */}
          <div className="w-full sm:w-auto">
            <label className="flex flex-col h-10 w-full sm:w-72">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-3 rounded-l-lg border-r-0">
                  <Icons.SearchIcon className="w-5 h-5" />
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-slate-100 dark:bg-slate-800 focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                  placeholder="Search by name or email..."
                />
              </div>
            </label>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="text-left">
                  <th className="p-4 w-12 text-slate-600 dark:text-slate-300 font-medium">
                    <input
                      className="form-checkbox h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-primary/50"
                      type="checkbox"
                    />
                  </th>
                  <th className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    User
                  </th>
                  <th className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    Role
                  </th>
                  <th className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    Last Login
                  </th>
                  <th className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    Status
                  </th>
                  <th className="p-4 w-12 text-slate-600 dark:text-slate-300 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="p-4">
                      <input
                        className="form-checkbox h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-primary/50"
                        type="checkbox"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                          style={{ backgroundImage: `url("${user.avatar}")` }}
                        ></div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {user.name}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {user.role}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {user.lastLogin}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                            : user.status === "Invited"
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                        <Icons.MoreVertIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ConsultingDashboardLayout>
  );
}
