/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shuruq: {
          bg: "#0C0E12",
          surface: "#15171D",
          surfaceLight: "#1C2028",
          surfaceElevated: "#232834",
          border: "#262A34",
          borderGold: "rgba(240, 185, 11, 0.3)",
          gold: "#F0B90B",
          goldHover: "#D9A608",
          goldMuted: "rgba(240, 185, 11, 0.15)",
          textPrimary: "#FFFFFF",
          textSecondary: "#94A3B8",
          textMuted: "#64748B",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
