/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3fff7',
          100: '#b3ffe6',
          200: '#80ffd4',
          300: '#4dffc3',
          400: '#26ffb6',
          500: '#00e69d',
          600: '#00b37a',
          700: '#008058',
          800: '#004d35',
          900: '#001a12',
        },
      },
    },
  },
  plugins: [],
}
