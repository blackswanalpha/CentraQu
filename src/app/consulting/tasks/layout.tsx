'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'All Tasks', href: '/consulting/tasks' },
    { name: 'My Tasks', href: '/consulting/tasks/my-tasks' },
    { name: 'Calendar', href: '/consulting/tasks/calendar' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          {/* Page Heading and Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-72 flex-col gap-3">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Tasks
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Example action button - Add Task */}
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
                <span className="material-symbols-outlined text-base">add</span>
                <span className="truncate">Add Task</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 gap-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} passHref legacyBehavior>
                <a
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 ${
                    pathname === item.href || (item.href === '/consulting/tasks' && pathname === '/consulting/tasks') // Added special condition for the root path
                      ? 'border-b-primary text-gray-900 dark:text-white'
                      : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">{item.name}</p>
                </a>
              </Link>
            ))}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
