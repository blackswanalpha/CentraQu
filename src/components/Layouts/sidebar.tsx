"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ChevronUpIcon } from "./sidebar-icons";
import { NAV_DATA } from "./sidebar-data";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    // Keep collapsible open when its subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        if (item.items && item.items.length > 0) {
          return item.items.some((subItem) => {
            if (subItem.url === pathname) {
              if (!expandedItems.includes(item.title)) {
                toggleExpanded(item.title);
              }
              return true;
            }
          });
        }
        return false;
      });
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`max-w-[250px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-900 ${
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen"
        } ${isOpen ? "w-full" : "w-0"}`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          {/* Logo */}
          <div className="relative pr-4.5">
            <Link
              href="/dashboard"
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div className="hidden min-[850px]:block">
                  <div className="font-bold text-dark">
                    CentraQu-AceQu
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Audit platform
                  </div>
                </div>
              </div>
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>
                <ArrowLeftIcon className="ml-auto w-7 h-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10 scrollbar-hide">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items && item.items.length > 1 ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon className="w-6 h-6 shrink-0" />
                              <span>{item.title}</span>
                              <ChevronUpIcon
                                className={`ml-auto w-5 h-5 rotate-180 transition-transform duration-200 ${
                                  expandedItems.includes(item.title)
                                    ? "rotate-0"
                                    : ""
                                }`}
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2">
                                {item.items.map((subItem) => (
                                  <li key={subItem.title}>
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <MenuItem
                            className="flex items-center gap-3 py-3"
                            as="link"
                            href={item.items[0]?.url || "/"}
                            isActive={pathname === item.items[0]?.url}
                          >
                            <item.icon className="w-6 h-6 shrink-0" />
                            <span>{item.title}</span>
                          </MenuItem>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

