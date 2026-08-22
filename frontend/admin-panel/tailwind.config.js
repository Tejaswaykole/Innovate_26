/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#e6e8ea",
        "secondary": "#475569",
        "surface-container": "#eceef0",
        "on-primary-fixed": "#00174b",
        "inverse-on-surface": "#eff1f3",
        "error": "#ba1a1a",
        "on-error-container": "#410002",
        "secondary-container": "#cde7ec",
        "on-secondary-container": "#051f23",
        "on-secondary": "#ffffff",
        "primary": "#2563EB",
        "on-surface-variant": "#43474e",
        "surface-container-highest": "#e0e2e5",
        "on-primary": "#ffffff",
        "error-container": "#ffdad6",
        "on-surface": "#0F172A",
        "primary-container": "#d7e3ff",
        "on-primary-container": "#001b3f",
        "surface": "#F8FAFC",
        "on-error": "#ffffff",
        "outline": "#73777f",
        "outline-variant": "#c3c6cf",
        "accent": "#C84800"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}