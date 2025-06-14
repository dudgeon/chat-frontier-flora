/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/web/App.tsx',
    './apps/web/src/**/*.{js,jsx,ts,tsx}',
    './packages/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
