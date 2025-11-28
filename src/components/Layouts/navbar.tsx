"use client";

import { SearchIcon, SidebarToggleIcon } from "./sidebar-icons";
import { MenuIcon } from "./sidebar-icons";
import { useSidebarContext } from "./sidebar-context";
import { ThemeToggleSwitch } from "./theme-toggle";
import { NotificationDropdown } from "./notification-dropdown";
import { UserProfileDropdown } from "./user-profile-dropdown";

export function Navbar() {
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
          Dashboard
        </h1>
      </div>

      {/* Right: Search, Theme, Notifications, User */}
      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        {/* Sidebar Toggle Button (Desktop Only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex rounded-lg border border-gray-200 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-800 hover:dark:bg-gray-700 hover:bg-gray-50"
          aria-label="Toggle Sidebar"
        >
          <SidebarToggleIcon className="w-4 h-4" />
        </button>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-xs">
          <input
            type="search"
            placeholder="Search..."
            className="flex w-full items-center gap-3.5 rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus-visible:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus-visible:border-primary"
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
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}

