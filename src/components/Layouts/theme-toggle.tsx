"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./header-icons";

const THEMES = [
  {
    name: "light",
    Icon: SunIcon,
  },
  {
    name: "dark",
    Icon: MoonIcon,
  },
];

export function ThemeToggleSwitch() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="group rounded-full bg-gray-100 p-[5px] text-gray-700 outline-1 outline-primary focus-visible:outline dark:bg-gray-800 dark:text-gray-300"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="sr-only">
        Switch to {theme === "light" ? "dark" : "light"} mode
      </span>

      <span aria-hidden className="relative flex gap-2.5">
        {/* Indicator */}
        <span className="absolute size-[38px] rounded-full border border-gray-300 bg-white transition-all dark:translate-x-[48px] dark:border-none dark:bg-gray-700 dark:group-hover:bg-gray-600" />

        {THEMES.map(({ name, Icon }) => (
          <span
            key={name}
            className="relative grid size-[38px] place-items-center rounded-full"
          >
            <Icon className="size-5" />
          </span>
        ))}
      </span>
    </button>
  );
}

