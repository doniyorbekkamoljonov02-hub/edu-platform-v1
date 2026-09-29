/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7000FF',
          50: '#F3E8FF',
          100: '#E4CCFF',
          200: '#C999FF',
          300: '#AE66FF',
          400: '#9333FF',
          500: '#7000FF',
          600: '#5A00CC',
          700: '#440099',
          800: '#2D0066',
          900: '#170033',
        },
      },
    },
  },
  plugins: [],
}

