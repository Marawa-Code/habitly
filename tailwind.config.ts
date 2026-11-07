import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        hairline: "rgb(var(--hairline-rgb) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary-rgb) / <alpha-value>)",
          faint: "rgb(var(--ink-faint-rgb) / <alpha-value>)",
        },
        mint: {
          DEFAULT: "#86C5A6",
          tint: "rgb(var(--mint-tint-rgb) / <alpha-value>)",
        },
        sky: {
          DEFAULT: "#5BB5E0",
          light: "#A5D4EA",
          "light-tint": "rgb(var(--sky-light-tint-rgb) / <alpha-value>)",
        },
        action: {
          DEFAULT: "rgb(var(--action-rgb) / <alpha-value>)",
          pressed: "rgb(var(--action-pressed-rgb) / <alpha-value>)",
        },
        "info-text": "rgb(var(--info-text-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        input: "8px",
        card: "12px",
        container: "16px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05)",
        modal: "0 12px 32px rgba(0, 0, 0, 0.20)",
      },
    },
  },
  plugins: [],
};

export default config;
