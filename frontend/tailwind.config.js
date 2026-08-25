/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uzum: {
          50: '#f5f0ff',
          100: '#ece3ff',
          200: '#d9c9ff',
          300: '#bd9eff',
          400: '#9b6aff',
          500: '#7000ff', // Uzum main purple
          600: '#6000e6',
          700: '#5000cc',
          800: '#4100a6',
          900: '#340084',
          accent: '#ff0055',
          yellow: '#ffbe00',
          dark: '#1f2026',
          lightBg: '#f2f4f7'
        }
      }
    },
  },
  plugins: [],
}
