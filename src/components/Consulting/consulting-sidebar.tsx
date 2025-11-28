"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ChevronUpIcon } from "../Layouts/sidebar-icons";
import { CONSULTING_NAV_DATA } from "./consulting-sidebar-data";
import { MenuItem } from "../Layouts/menu-item";
import { useSidebarContext } from "../Layouts/sidebar-context";

export function ConsultingSidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    // Keep collapsible open when its subpage is active
    CONSULTING_NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }
            return true;
          }
        });
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
        className={`max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-900 ${
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen"
        } ${isOpen ? "w-full" : "w-0"}`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          {/* Logo */}
          <div className="relative pr-4.5">
            <Link
              href="/consulting/dashboard"
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-dark hidden min-[850px]:inline dark:text-white">
                  CentraQu
                </span>
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
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {CONSULTING_NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
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

                            {/* Submenu */}
                            <div
                              className={`overflow-hidden transition-all duration-200 ${
                                expandedItems.includes(item.title)
                                  ? "max-h-96 opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <ul className="mt-2 space-y-1 pl-11">
                                {item.items.map((subItem) => (
                                  <li key={subItem.url}>
                                    <Link
                                      href={subItem.url}
                                      onClick={() => isMobile && toggleSidebar()}
                                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                        pathname === subItem.url
                                          ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400"
                                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                                      }`}
                                    >
                                      {subItem.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={item.url || "#"}
                            onClick={() => isMobile && toggleSidebar()}
                          >
                            <MenuItem isActive={pathname === item.url}>
                              <item.icon className="w-6 h-6 shrink-0" />
                              <span>{item.title}</span>
                            </MenuItem>
                          </Link>
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

