/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        surface: "#141A2A",
        surfaceHover: "#1B2333",
        accent: "#5EEAD4",
        accentMuted: "#2DD4BF",
        border: "#232B3D",
        textPrimary: "#E2E8F0",
        textSecondary: "#94A3B8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};