"use client";

export type Theme = "light" | "dark" | "system";

const THEME_KEY = "habitly_theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // no-op
  }
  return "system";
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // no-op
  }

  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  window.dispatchEvent(new CustomEvent("habitly_theme_change", { detail: { theme, isDark } }));
}

