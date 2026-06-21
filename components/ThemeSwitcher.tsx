"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[104px] h-8 bg-slate-200/40 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-xl animate-pulse" />
    );
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="relative flex items-center p-1 bg-slate-200/50 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-xl">
      {/* Sliding background indicator */}
      <div
        className={`absolute top-1 bottom-1 left-1 w-8 bg-white dark:bg-zinc-900 border border-black/[0.03] dark:border-white/5 rounded-lg shadow-sm transition-transform duration-200 ease-out z-0 ${
          theme === "light" ? "translate-x-0" :
          theme === "dark" ? "translate-x-8" :
          "translate-x-16"
        }`}
      />
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`relative flex items-center justify-center h-6 w-8 rounded-lg transition-colors duration-200 z-10 ${
              isActive
                ? "text-slate-900 dark:text-white"
                : "text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
            title={`Set ${opt.label} theme`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
