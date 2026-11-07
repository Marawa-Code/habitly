import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F6FAF9",
        surface: "#FFFFFF",
        hairline: "#DDE7E4",
        ink: {
          DEFAULT: "#1E2B2A",
          secondary: "#52625F",
          faint: "#8A9895",
        },
        mint: {
          DEFAULT: "#86C5A6",
          tint: "#E4F3EC",
        },
        sky: {
          DEFAULT: "#5BB5E0",
          light: "#A5D4EA",
          "light-tint": "#E6F3FA",
        },
        action: {
          DEFAULT: "#2F7A5C",
          pressed: "#25634A",
        },
        "info-text": "#2A5670",
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
        soft: "0 1px 2px rgba(30,43,42,0.04), 0 4px 12px rgba(30,43,42,0.04)",
        modal: "0 12px 32px rgba(30,43,42,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
