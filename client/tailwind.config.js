/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme (GitHub Dark-inspired)
        background: "#0D1117",
        sidebar: "#161B22",
        surfaceHover: "#1F2937",
        border: "#30363D",
        textPrimary: "#E6EDF3",
        textSecondary: "#8B949E",
        accent: "#58A6FF",
        accentSoft: "#1F3A5F",

        // Legacy aliases — kept mapped to dark equivalents so any
        // not-yet-migrated page doesn't break.
        surface: "#161B22",
        accentMuted: "#79C0FF",
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
      keyframes: {
        scroll: {
          to: { transform: "translate(calc(-50% - 0.5rem))" },
        },
      },
      animation: {
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
  plugins: [],
};