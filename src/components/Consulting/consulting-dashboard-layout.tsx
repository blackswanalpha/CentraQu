"use client";

import { SidebarProvider } from "../Layouts/sidebar-context";
import { ConsultingSidebar } from "./consulting-sidebar";
import { ConsultingNavbar } from "./consulting-navbar";

export function ConsultingDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar */}
        <ConsultingSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Navbar */}
          <ConsultingNavbar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

