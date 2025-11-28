"use client";

import { useEffect, useRef, useState } from "react";
import { BellIcon } from "./sidebar-icons";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const notificationList: Notification[] = [
  {
    id: "1",
    title: "New Audit Request",
    message: "ABC Corporation submitted a new audit request",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Project Completed",
    message: "Financial audit for XYZ Ltd has been completed",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Team Member Added",
    message: "John Doe has been added to your team",
    timestamp: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "Report Generated",
    message: "Compliance report for Q4 is ready for review",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "5",
    title: "Deadline Reminder",
    message: "Audit deadline for DEF Inc is tomorrow",
    timestamp: "2 days ago",
    read: true,
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDotVisible, setIsDotVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notificationList.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isDotVisible) setIsDotVisible(false);
        }}
        className="grid size-12 place-items-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus-visible:border-primary"
        aria-label="View Notifications"
        aria-expanded={isOpen}
      >
        <span className="relative">
          <BellIcon className="w-5 h-5" />

          {isDotVisible && (
            <span className="absolute right-0 top-0 z-1 size-2 rounded-full bg-red-500 ring-2 ring-gray-50 dark:ring-gray-800">
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-500 opacity-75" />
            </span>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Notifications List */}
          <ul className="max-h-96 space-y-0 overflow-y-auto">
            {notificationList.map((notification) => (
              <li
                key={notification.id}
                className={`border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
                  !notification.read ? "bg-blue-50 dark:bg-gray-800/50" : ""
                }`}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="mt-2 size-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full border-t border-gray-200 px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

