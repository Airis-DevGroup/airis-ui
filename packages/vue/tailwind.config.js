/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minHeight: {
        6: '1.5rem',
        12: '3rem',
      },
      minWidth: {
        6: '1.5rem',
        12: '3rem',
      },
    },
  },
  plugins: [],
};
