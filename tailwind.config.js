/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './*.js',
    './js/**/*.js',
    './js_piano_assets/**/*.js',
    './netlify/functions/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
