/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Checks all JS/JSX files in src
  ],
  theme: {
    extend: {
      transitionDuration: {
        '300': '300ms',
      }
    },
  },
  plugins: [],
  safelist: [
    { pattern: /.*/ } // TEMPORARY - REMOVE AFTER VERIFICATION
  ],
}