module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./apps/**/*.{js,jsx,ts,tsx}",
    "./packages/**/*.{js,jsx,ts,tsx}",
    "./**/*.tsx"
  ],
  theme: { extend: {} },
  plugins: []
};
