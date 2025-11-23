"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "dd-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  const prefersLight = window.matchMedia?.(
    "(prefers-color-scheme: light)"
  ).matches;

  return prefersLight ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Init from storage / system
  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // Sync changes til <html data-theme="...">
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={`Skift til ${isLight ? "dark" : "light"} mode`}
      className={[
        "dd-theme-toggle group flex items-center gap-2 border px-1.5 py-1",
        "border-slate-700/70 bg-slate-950/70 backdrop-blur-md",
        "data-[light=true]:border-slate-300/70 data-[light=true]:bg-white/80",
        "transition-colors",
      ].join(" ")}
      data-light={String(isLight)}
    >
      {/* Labels */}
      <span
        className={[
          "text-[10px] font-semibold uppercase tracking-[0.16em]",
          "text-slate-300 group-data-[light=true]:text-slate-500",
        ].join(" ")}
      >
        Dark
      </span>
      <span
        className={[
          "text-[10px] font-semibold uppercase tracking-[0.16em]",
          "text-slate-500 group-data-[light=true]:text-slate-900",
        ].join(" ")}
      >
        Light
      </span>

      {/* Track */}
      <div className="relative ml-1 h-6 w-11 rounded-full bg-slate-900/80 group-data-[light=true]:bg-slate-200/90">
        {/* Thumb */}
        <div
          className={[
            "dd-theme-toggle-thumb absolute top-0.5 h-5 w-5 rounded-full",
            "bg-gradient-to-br from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-yellow)]",
            "group-data-[light=true]:dd-theme-toggle-thumb--light",
            "group-data-[light=true]:from-cyan-300 group-data-[light=true]:via-sky-300 group-data-[light=true]:to-amber-200",
          ].join(" ")}
          style={{
            transform: isLight ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </div>
    </button>
  );
}
