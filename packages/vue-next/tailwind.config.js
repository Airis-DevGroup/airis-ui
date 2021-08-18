module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
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
  variants: {
    extend: {},
  },
  plugins: [],
};
