"use client";

import { useEffect } from "react";
import { getStoredTheme, applyTheme } from "@/lib/theme";

export default function ThemeProvider() {
  useEffect(() => {
    // Terapkan tema saat awal muat
    const initialTheme = getStoredTheme();
    applyTheme(initialTheme);

    // Dengar perubahan tema kustom
    function handleThemeChange() {
      const current = getStoredTheme();
      applyTheme(current);
    }
    window.addEventListener("habitly_theme_change", handleThemeChange);

    // Dengar preferensi tema sistem (OS) jika opsi 'system' aktif
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    function handleSystemChange() {
      if (getStoredTheme() === "system") {
        applyTheme("system");
      }
    }
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("habitly_theme_change", handleThemeChange);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  return null;
}

