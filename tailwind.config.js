/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",          // wszystkie pliki w app/ (layouty, indexy, tabs, auth, properties)
    "./components/**/*.{ts,tsx}",   // wszystkie komponenty
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
