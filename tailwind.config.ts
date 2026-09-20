import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          deep: "#070a10",
          primary: "#0b0f19",
          secondary: "#0f1523",
          card: "#141b2b",
          elevated: "#1a2236",
          border: "rgba(0, 180, 216, 0.16)",
          active: "rgba(0, 255, 156, 0.4)",
          green: "#00ff9c",
          cyan: "#00b4d8",
          blue: "#58a6ff",
          purple: "#9d4edd",
          critical: "#ff4d4d",
          high: "#ff922b",
          medium: "#fcc419",
          low: "#20c997",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
