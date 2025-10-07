/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          300: '#B5FFD9',
          400: '#98FFCC',
          500: '#7DFFC0',
          600: '#5CE0A9',
        },
      },
    },
  },
  plugins: [],
}
