/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#a9c2e2',
          400: '#8eadd2',
          500: '#7598c2',
          600: '#607fa6',
        },
        dark: {
          bg: '#121416',
          sidebar: '#101214',
          surface: '#181b1f',
          card: '#191c20',
          hover: '#1e2227',
          border: '#2a2e34',
        }
      }
    },
  },
  plugins: [],
}