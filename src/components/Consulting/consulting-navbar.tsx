"use client";

import { SearchIcon, MenuIcon } from "../Layouts/sidebar-icons";
import { useSidebarContext } from "../Layouts/sidebar-context";
import { ThemeToggleSwitch } from "../Layouts/theme-toggle";
import { NotificationDropdown } from "../Layouts/notification-dropdown";
import { ConsultingUserProfileDropdown } from "./consulting-user-profile-dropdown";

export function ConsultingNavbar() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-6 lg:px-8">
      {/* Left: Menu Button */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg border border-gray-200 px-1.5 py-1 dark:border-gray-700 dark:bg-gray-800 hover:dark:bg-gray-700 lg:hidden"
        aria-label="Toggle Sidebar"
      >
        <MenuIcon className="w-5 h-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {/* Center: Page Title (Desktop Only) */}
      <div className="max-lg:hidden">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Consulting Platform
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Project Management & Resources
        </p>
      </div>

      {/* Right: Search, Theme, Notifications, User */}
      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-xs">
          <input
            type="search"
            placeholder="Search..."
            className="flex w-full items-center gap-3.5 rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus-visible:border-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus-visible:border-blue-600"
            aria-label="Search"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Theme Toggle */}
        <ThemeToggleSwitch />

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Profile */}
        <div className="shrink-0">
          <ConsultingUserProfileDropdown />
        </div>
      </div>
    </header>
  );
}

