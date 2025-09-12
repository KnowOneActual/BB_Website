/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // This now specifically targets HTML and JS files in your project's root 
    // and other relevant folders, safely ignoring node_modules.
    "./*.html",
    "./*.js",
    "./js_piano_assets/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
