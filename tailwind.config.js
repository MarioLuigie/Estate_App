/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",          // wszystkie pliki w app/ (layouty, indexy, tabs, auth, properties)
    "./components/**/*.{js,jsx,ts,tsx}",   // wszystkie komponenty
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
