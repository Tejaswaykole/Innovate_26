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
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f5f9",
        "on-error": "#ffffff",
        "outline": "#73777f",
        "outline-variant": "#c3c6cf",
        "accent": "#C84800"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        'xxl': '4rem',
        'gutter': '1.5rem',
      },
      fontSize: {
        'headline-lg': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        'headline-lg-mobile': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'label-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}