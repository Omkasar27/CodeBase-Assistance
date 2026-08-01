/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Current design system (light, Notion/GitHub-inspired)
        background: "#FFFFFF",
        sidebar: "#F7F7F5",
        surfaceHover: "#EFEFED",
        border: "#E9E9E7",
        textPrimary: "#37352F",
        textSecondary: "#787774",
        accent: "#2383E2",
        accentSoft: "#EBF3FC",

        // Legacy aliases — kept so pages not yet migrated off the old dark
        // theme (Chat, Insights, Settings, etc.) don't break. Remove once
        // every page has been redesigned.
        surface: "#FFFFFF",
        accentMuted: "#1B6FC2",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};