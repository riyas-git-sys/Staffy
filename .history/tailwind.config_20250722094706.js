/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Checks all JS/JSX files in src
  ],
  theme: {
    extend: {
      transitionDuration: {
        '300': '300ms',
      },
      transitionProperty: {
        'transform': 'transform',
      },
    },
  },
  plugins: [],
  safelist: [],
}