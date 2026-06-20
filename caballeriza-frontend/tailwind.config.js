/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tierra: {
          50:  '#fdf8f0',
          100: '#f5e6d0',
          200: '#e8c99a',
          300: '#d4a96a',
          400: '#b8863f',
          500: '#8b6030',
          600: '#6b4423',
          700: '#4e2f18',
          800: '#321e0f',
          900: '#1a0f07',
        },
        salvia: {
          50:  '#f2f7f2',
          100: '#d8ebd8',
          200: '#aed0ae',
          300: '#7fb07f',
          400: '#568f56',
          500: '#3d6b3d',
          600: '#2c4e2c',
          700: '#1e361e',
          800: '#112111',
          900: '#070f07',
        },
        crema: {
          50:  '#fffef9',
          100: '#fdf8ec',
          200: '#f8ecce',
          300: '#f0d99e',
          400: '#e4c06a',
          500: '#d4a43a',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}