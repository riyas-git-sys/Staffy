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
      },
      transitionProperty: {
        'transform': 'transform',
      },
      animation: {
        'orbiting-rgb': 'orbiting-rgb 4s linear infinite',
      },
      keyframes: {
        'orbiting-rgb': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(calc(100% + 8px), 0)' },
          '50%': { transform: 'translate(calc(100% + 8px), calc(100% + 8px))' },
          '75%': { transform: 'translate(0, calc(100% + 8px))' },
          '100%': { transform: 'translate(0, 0)' },
        }
      }
    },
  },
  plugins: [],
  safelist: [
    { pattern: /.*/ } // TEMPORARY - REMOVE AFTER VERIFICATION
  ],
}